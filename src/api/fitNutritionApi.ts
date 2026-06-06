import { apiRequest, unwrapList } from './http';
import type { Appointment, Consultation, Diet, DietFoodMapping, Doctor, Food, FoodItem, LoginResponse, Patient } from '../types/models';

const mealTimes: FoodItem['mealTime'][] = ['Breakfast', 'Mid-day', 'Lunch', 'Dinner'];

function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function isValidDoctorId(value: unknown): value is number {
  const id = Number(value);
  return Number.isFinite(id) && id > 0;
}

function formatDoctorName(doctor: Doctor): string {
  return `${doctor.nombreMedico} ${doctor.apellidosMedico}`.trim();
}

function normalizeLoginResponse(payload: any): LoginResponse {
  if (payload?.error) {
    throw new Error(payload?.mensaje ?? 'Access denied.');
  }

  const token = payload?.token ?? payload?.accessToken ?? payload?.data?.token;
  const usuario = payload?.usuario ?? payload?.user ?? payload?.data?.usuario;

  if (!token || !usuario?.idUsuario) {
    throw new Error('La respuesta de inicio de sesión no incluyó token y usuario.idUsuario.');
  }

  return { token, usuario };
}

export async function login(email: string, codigoAcceso: string): Promise<LoginResponse> {
  const payload = await apiRequest('/autenticacion/ingresar-movil', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      codigoAcceso,
    }),
  });

  return normalizeLoginResponse(payload);
}

export async function getProfile(idUsuario: number, token?: string | null): Promise<Patient> {
  const patient = await apiRequest<Patient>(`/pacientes/${idUsuario}`, { token });
  const doctor = await getDoctor(patient.idMedico, token);
  return { ...patient, medico: doctor };
}

export async function updatePatientProfile(
  idPaciente: number,
  patientData: Partial<Patient>,
  token?: string | null,
): Promise<Patient> {
  return apiRequest<Patient>(`/pacientes/${idPaciente}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(patientData),
  });
}

export function getDoctor(idMedico: number, token?: string | null): Promise<Doctor> {
  return apiRequest<Doctor>(`/medicos/${idMedico}`, { token });
}

export async function getAppointments(idPaciente: number, token?: string | null): Promise<Appointment[]> {
  const payload = await apiRequest<Appointment[] | { data?: Appointment[]; items?: Appointment[]; rows?: Appointment[] }>('/citas', { token });
  const patientAppointments = unwrapList(payload).filter((appointment) => Number(appointment.idPaciente) === Number(idPaciente));

  const uniqueDoctorIds = Array.from(
    new Set(
      patientAppointments.flatMap((appointment) => {
        const ids: number[] = [];

        if (isValidDoctorId(appointment.idMedico)) {
          ids.push(Number(appointment.idMedico));
        }

        if (isValidDoctorId(appointment.idMedicoAnterior)) {
          ids.push(Number(appointment.idMedicoAnterior));
        }

        return ids;
      }),
    ),
  );

  const doctorEntries = await Promise.all(
    uniqueDoctorIds.map(async (doctorId) => {
      try {
        const doctor = await getDoctor(doctorId, token);
        return [doctorId, formatDoctorName(doctor)] as const;
      } catch {
        return [doctorId, `Médico #${doctorId}`] as const;
      }
    }),
  );

  const doctorNameById = new Map<number, string>(doctorEntries);

  return patientAppointments.map((appointment) => {
    const currentDoctorId = Number(appointment.idMedico);
    const previousDoctorId = appointment.idMedicoAnterior == null ? null : Number(appointment.idMedicoAnterior);
    const hasReassignment = previousDoctorId != null && previousDoctorId !== currentDoctorId;

    return {
      ...appointment,
      doctorName: appointment.doctorName ?? doctorNameById.get(currentDoctorId),
      previousDoctorName: hasReassignment ? doctorNameById.get(previousDoctorId) : undefined,
    };
  });
}

export async function getAppointmentById(id: number, token?: string | null): Promise<Appointment> {
  return apiRequest<Appointment>(`/citas/${id}`, { token });
}

export async function cancelAppointment(appointment: Appointment, reason: string, token?: string | null): Promise<Appointment> {
  const observaciones = [appointment.observaciones, `Motivo de cancelacion: ${reason.trim()}`].filter(Boolean).join('\n');

  const updated = await apiRequest<Appointment | null>(`/citas/${appointment.idCita}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({
      ...appointment,
      estado: 'Cancelada',
      observaciones,
    }),
  });

  return updated && typeof updated === 'object' ? updated : { ...appointment, estado: 'Cancelada', observaciones };
}

export async function getConsultations(idPaciente: number, token?: string | null): Promise<Consultation[]> {
  const payload = await apiRequest<Consultation[] | { data?: Consultation[]; items?: Consultation[]; rows?: Consultation[] }>('/consultas', { token });
  return unwrapList(payload)
    .filter((consultation) => Number(consultation.idPaciente) === Number(idPaciente))
    .sort((a, b) => `${b.fecha}`.localeCompare(`${a.fecha}`));
}

export async function getDietMaster(idDieta: number, token?: string | null): Promise<Diet> {
  const diet = await apiRequest<Omit<Diet, 'assignmentDate' | 'estimatedDuration' | 'nextReviewDate' | 'notes' | 'foods'>>(
    `/catalogos/dietas/${idDieta}`,
    { token },
  );

  return {
    ...diet,
    caloriasTotales: toNumber(diet.caloriasTotales),
    assignmentDate: '',
    estimatedDuration: 'Pending review',
    nextReviewDate: '',
    notes: '',
    foods: [],
  };
}

export async function getDietDetail(idDieta: number, token?: string | null, consultation?: Consultation): Promise<Diet> {
  const diet = await getDietMaster(idDieta, token);
  const mappingsPayload = await apiRequest<DietFoodMapping[] | { data?: DietFoodMapping[]; items?: DietFoodMapping[]; rows?: DietFoodMapping[] }>(
    `/dieta-alimentos/dieta/${idDieta}`,
    { token },
  );
  const mappings = unwrapList(mappingsPayload);

  const foods = await Promise.all(
    mappings.map(async (mapping, index) => {
      const food = await apiRequest<Food>(`/catalogos/alimentos/${mapping.idAlimento}`, { token });
      return {
        idAlimento: mapping.idAlimento,
        nombreAlimento: food.nombreAlimento,
        porcion: mapping.porcion,
        caloriasPorcion: toNumber(mapping.caloriasPorcion),
        mealTime: mealTimes[index % mealTimes.length],
      };
    }),
  );

  return {
    ...diet,
    assignmentDate: consultation?.fecha ?? '',
    notes: consultation?.observaciones ?? '',
    foods,
  };
}

export async function getCurrentDiet(idPaciente: number, token?: string | null): Promise<Diet> {
  const consultations = await getConsultations(idPaciente, token);
  const latest = consultations[0];
  if (!latest) {
    throw new Error('No consultations found for this patient.');
  }

  return getDietDetail(latest.idDieta, token, latest);
}

export async function getDietHistory(idPaciente: number, token?: string | null): Promise<Diet[]> {
  const consultations = await getConsultations(idPaciente, token);
  const uniqueConsultations = consultations.filter(
    (consultation, index, list) => list.findIndex((item) => Number(item.idDieta) === Number(consultation.idDieta)) === index,
  );

  return Promise.all(uniqueConsultations.map((consultation) => getDietDetail(consultation.idDieta, token, consultation)));
}

export async function getLatestMeasurement(idPaciente: number, token?: string | null): Promise<Consultation> {
  const consultations = await getConsultations(idPaciente, token);
  if (!consultations[0]) {
    throw new Error('No measurement history found for this patient.');
  }

  return consultations[0];
}

export function getProgressHistory(idPaciente: number, token?: string | null): Promise<Consultation[]> {
  return getConsultations(idPaciente, token);
}
