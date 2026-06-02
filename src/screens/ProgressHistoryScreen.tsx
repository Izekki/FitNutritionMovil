import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { getProgressHistory } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Consultation } from '../types/models';
import { formatDate } from '../utils/date';

export function ProgressHistoryScreen() {
  const { patient, token, isLoading: isPatientLoading, error: patientError, reload } = usePatientProfile();
  const [consultations, setConsultations] = useState<Consultation[] | null>(null);
  const [error, setError] = useState('');

  async function loadHistory() {
    if (!patient?.idPaciente) return;
    setError('');
    try {
      const result = await getProgressHistory(patient.idPaciente, token);
      setConsultations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load progress history.');
    }
  }

  useEffect(() => {
    loadHistory();
  }, [patient?.idPaciente, token]);

  if (patientError) {
    return <ErrorState message={patientError} onRetry={reload} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadHistory} />;
  }

  if (isPatientLoading || !consultations) {
    return <LoadingState />;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      {consultations.map((consultation) => (
        <View key={consultation.idConsulta} style={globalStyles.card}>
          <Text style={globalStyles.value}>{formatDate(consultation.fecha)}</Text>
          <Text style={globalStyles.muted}>Weight: {consultation.pesoCapturado} kg</Text>
          <Text style={globalStyles.muted}>Height: {consultation.tallaCapturada} m</Text>
          <Text style={globalStyles.muted}>BMI: {consultation.imcCalculado}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
