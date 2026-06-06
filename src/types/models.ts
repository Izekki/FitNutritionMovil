export type Doctor = {
  idMedico: number;
  nombreMedico: string;
  apellidosMedico: string;
  telefono: string;
};

export type Patient = {
  idPaciente: number;
  idMedico: number;
  nombrePaciente: string;
  apellidosPaciente: string;
  fechaNacimiento: string;
  genero: 'M' | 'F' | 'Otro';
  peso: number;
  estatura: number;
  talla: number;
  email: string;
  telefono: string;
  domicilio: string;
  fotografia?: string;
  codigoAcceso: string;
  medico?: Doctor;
};

export type AppointmentStatus = 'Asignada' | 'Cancelada' | 'Reagendada' | 'Asistida' | 'Ausente';

export type Appointment = {
  idCita: number;
  idPaciente: number;
  idMedico: number;
  idMedicoAnterior?: number | null;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
  observaciones?: string;
  patientName?: string;
  doctorName?: string;
  previousDoctorName?: string;
};

export type FoodItem = {
  idAlimento: number;
  nombreAlimento: string;
  porcion: string;
  caloriasPorcion: number;
  mealTime: 'Breakfast' | 'Mid-day' | 'Lunch' | 'Dinner';
};

export type Food = {
  idAlimento: number;
  nombreAlimento: string;
  calorias: number;
  porcion: string;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
};

export type DietFoodMapping = {
  idDietaAlimento: number;
  idDieta: number;
  idAlimento: number;
  porcion: string;
  caloriasPorcion: number;
};

export type Diet = {
  idDieta: number;
  nombreDieta: string;
  caloriasTotales: number;
  descripcion: string;
  estatusEdicion: 'Editable' | 'Bloqueada';
  assignmentDate: string;
  estimatedDuration: string;
  nextReviewDate: string;
  notes: string;
  foods: FoodItem[];
};

export type Consultation = {
  idConsulta: number;
  idPaciente: number;
  idMedico: number;
  idCita: number;
  idDieta: number;
  fecha: string;
  pesoCapturado: number;
  tallaCapturada: number;
  imcCalculado: number;
  observaciones?: string;
  patientHeight?: number;
};

export type AuthUser = {
  idUsuario: number;
  [key: string]: unknown;
};

export type LoginResponse = {
  token: string;
  usuario: AuthUser;
};
