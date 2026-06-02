import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { cancelAppointment, getAppointmentById } from '../api/fitNutritionApi';
import { AppButton } from '../components/AppButton';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Appointment } from '../types/models';
import type { RootStackParamList } from '../types/navigation';
import { canCancelAppointment, formatDate, formatTime } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentDetail'>;

export function AppointmentDetailScreen({ route }: Props) {
  const { patient, token, isLoading: isPatientLoading, error: patientError, reload } = usePatientProfile();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [reason, setReason] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadAppointment() {
    setError('');
    try {
      const result = await getAppointmentById(route.params.appointmentId, token);
      setAppointment(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle de la cita.');
    }
  }

  useEffect(() => {
    loadAppointment();
  }, [route.params.appointmentId, token]);

  if (patientError) {
    return <ErrorState message={patientError} onRetry={reload} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAppointment} />;
  }

  if (isPatientLoading || !appointment) {
    return <LoadingState />;
  }

  const cancellationAllowed = canCancelAppointment(appointment.fecha, appointment.hora);

  async function handleConfirmCancellation() {
    if (!appointment) return;

    setSaving(true);
    try {
      const updated = await cancelAppointment(appointment, reason, token);
      setAppointment(updated);
      Alert.alert('Cita cancelada', 'Tu solicitud de cancelación fue registrada.');
      setShowCancelForm(false);
      setReason('');
    } catch (err) {
      Alert.alert('Error al cancelar', err instanceof Error ? err.message : 'No se pudo cancelar la cita.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <View style={globalStyles.card}>
        <InfoRow label="Fecha" value={formatDate(appointment.fecha)} />
        <InfoRow label="Hora" value={formatTime(appointment.hora)} />
        <InfoRow label="Paciente" value={appointment.patientName ?? (patient ? `${patient.nombrePaciente} ${patient.apellidosPaciente}` : 'Paciente')} />
        <InfoRow label="Médico asignado" value={appointment.doctorName ?? (patient?.medico ? `${patient.medico.nombreMedico} ${patient.medico.apellidosMedico}` : 'Médico')} />
        <InfoRow label="Observaciones" value={appointment.observaciones} />
      </View>

      {!cancellationAllowed ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>La cancelación solo está disponible al menos 1 hora antes de la cita.</Text>
      ) : null}

      <AppButton disabled={!cancellationAllowed} title="Cancelar cita" variant="danger" onPress={() => setShowCancelForm(true)} />

      {showCancelForm ? (
        <View style={[globalStyles.card, { marginTop: 16 }]}>
          <Text style={globalStyles.sectionTitle}>Motivo de la cancelación</Text>
          <TextInput
            multiline
            onChangeText={setReason}
            placeholder="Escribe el motivo..."
            placeholderTextColor={colors.muted}
            style={[globalStyles.input, { minHeight: 110, paddingTop: 12, textAlignVertical: 'top' }]}
            value={reason}
          />
          <AppButton
            disabled={!reason.trim() || isSaving}
            onPress={handleConfirmCancellation}
            style={{ marginTop: 12 }}
            title={isSaving ? 'Confirmando...' : 'Confirmar cancelación'}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
