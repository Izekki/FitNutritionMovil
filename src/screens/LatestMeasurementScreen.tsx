import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { getLatestMeasurement } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Consultation } from '../types/models';
import { formatDate } from '../utils/date';

export function LatestMeasurementScreen() {
  const { patient, token, isLoading: isPatientLoading, error: patientError, reload } = usePatientProfile();
  const [measurement, setMeasurement] = useState<Consultation | null>(null);
  const [error, setError] = useState('');

  async function loadMeasurement() {
    if (!patient?.idPaciente) return;
    setError('');
    try {
      const result = await getLatestMeasurement(patient.idPaciente, token);
      setMeasurement(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load latest measurement.');
    }
  }

  useEffect(() => {
    loadMeasurement();
  }, [patient?.idPaciente, token]);

  if (patientError) {
    return <ErrorState message={patientError} onRetry={reload} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMeasurement} />;
  }

  if (isPatientLoading || !measurement) {
    return <LoadingState />;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <InfoRow label="Date" value={formatDate(measurement.fecha)} />
      <InfoRow label="Weight" value={`${measurement.pesoCapturado} kg`} />
      <InfoRow label="Height" value={`${measurement.tallaCapturada} m`} />
      <InfoRow label="BMI" value={measurement.imcCalculado} />
      <InfoRow label="Notes" value={measurement.observaciones} />
    </ScrollView>
  );
}
