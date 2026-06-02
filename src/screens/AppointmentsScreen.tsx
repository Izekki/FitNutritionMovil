import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { getAppointments } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Appointment } from '../types/models';
import type { RootStackParamList } from '../types/navigation';
import { formatDate, formatTime } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Appointments'>;

export function AppointmentsScreen({ navigation }: Props) {
  const { patient, token, isLoading: isPatientLoading, error: patientError, reload } = usePatientProfile();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');

  async function loadAppointments() {
    if (!patient?.idPaciente) return;
    setError('');
    try {
      const result = await getAppointments(patient.idPaciente, token);
      setAppointments(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las citas.');
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [patient?.idPaciente, token]);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (!dateFilter) return appointments;
    return appointments.filter((appointment) => appointment.fecha.includes(dateFilter));
  }, [appointments, dateFilter]);

  if (patientError) {
    return <ErrorState message={patientError} onRetry={reload} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAppointments} />;
  }

  if (isPatientLoading || !appointments) {
    return <LoadingState />;
  }

  const now = new Date();
  const scheduled = filteredAppointments.filter((appointment) => {
    const futureDate = new Date(`${appointment.fecha}T${appointment.hora}`).getTime() >= now.getTime();
    return futureDate || ['Asignada', 'Reagendada'].includes(appointment.estado);
  });
  const history = filteredAppointments.filter((appointment) => !scheduled.includes(appointment));

  function renderCard(appointment: Appointment) {
    return (
      <Pressable
        key={appointment.idCita}
        onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appointment.idCita })}
        style={({ pressed }) => [globalStyles.card, pressed && { opacity: 0.76 }]}
      >
        <Text style={globalStyles.value}>{formatDate(appointment.fecha)} a las {formatTime(appointment.hora)}</Text>
        <Text style={globalStyles.muted}>{appointment.estado} con {appointment.doctorName ?? patient?.medico?.nombreMedico ?? 'Médico'}</Text>
      </Pressable>
    );
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <View style={[globalStyles.card, { flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
        <Ionicons name="calendar-outline" size={22} color={colors.primaryDark} />
        <TextInput
          onChangeText={setDateFilter}
          placeholder="Buscador por fechas"
          placeholderTextColor={colors.muted}
          style={[globalStyles.input, { flex: 1, minHeight: 44 }]}
          value={dateFilter}
        />
      </View>
      <Text style={globalStyles.sectionTitle}>Citas programadas</Text>
      {scheduled.length ? scheduled.map(renderCard) : <Text style={globalStyles.muted}>No hay citas programadas.</Text>}
      <Text style={globalStyles.sectionTitle}>Historial de citas</Text>
      {history.length ? history.map(renderCard) : <Text style={globalStyles.muted}>No hay historial de citas.</Text>}
    </ScrollView>
  );
}
