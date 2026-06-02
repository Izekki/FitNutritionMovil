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
      setError(err instanceof Error ? err.message : 'Could not load appointment detail.');
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
      Alert.alert('Appointment canceled', 'Your cancellation request was registered.');
      setShowCancelForm(false);
      setReason('');
    } catch (err) {
      Alert.alert('Cancellation failed', err instanceof Error ? err.message : 'Could not cancel appointment.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <View style={globalStyles.card}>
        <InfoRow label="Date" value={formatDate(appointment.fecha)} />
        <InfoRow label="Time" value={formatTime(appointment.hora)} />
        <InfoRow label="Patient" value={appointment.patientName ?? (patient ? `${patient.nombrePaciente} ${patient.apellidosPaciente}` : 'Patient')} />
        <InfoRow label="Assigned Doctor" value={appointment.doctorName ?? (patient?.medico ? `${patient.medico.nombreMedico} ${patient.medico.apellidosMedico}` : 'Doctor')} />
        <InfoRow label="Notes" value={appointment.observaciones} />
      </View>

      {!cancellationAllowed ? (
        <Text style={{ color: colors.danger, marginBottom: 12 }}>Cancellation is only available at least 1 hour before the appointment time.</Text>
      ) : null}

      <AppButton disabled={!cancellationAllowed} title="Cancel Appointment" variant="danger" onPress={() => setShowCancelForm(true)} />

      {showCancelForm ? (
        <View style={[globalStyles.card, { marginTop: 16 }]}>
          <Text style={globalStyles.sectionTitle}>Reason for Cancellation</Text>
          <TextInput
            multiline
            onChangeText={setReason}
            placeholder="Write the reason..."
            placeholderTextColor={colors.muted}
            style={[globalStyles.input, { minHeight: 110, paddingTop: 12, textAlignVertical: 'top' }]}
            value={reason}
          />
          <AppButton
            disabled={!reason.trim() || isSaving}
            onPress={handleConfirmCancellation}
            style={{ marginTop: 12 }}
            title={isSaving ? 'Confirming...' : 'Confirm Cancellation'}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
