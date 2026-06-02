import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { getCurrentDiet } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Diet } from '../types/models';
import { formatDate } from '../utils/date';

export function CurrentDietScreen() {
  const { patient, token, isLoading: isPatientLoading, error: patientError, reload } = usePatientProfile();
  const [diet, setDiet] = useState<Diet | null>(null);
  const [error, setError] = useState('');

  async function loadDiet() {
    if (!patient?.idPaciente) return;
    setError('');
    try {
      const result = await getCurrentDiet(patient.idPaciente, token);
      setDiet(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load current diet.');
    }
  }

  useEffect(() => {
    loadDiet();
  }, [patient?.idPaciente, token]);

  if (patientError) {
    return <ErrorState message={patientError} onRetry={reload} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDiet} />;
  }

  if (isPatientLoading || !diet) {
    return <LoadingState />;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <InfoRow label="Name" value={diet.nombreDieta} />
      <InfoRow label="Status" value={diet.estatusEdicion} />
      <InfoRow label="Assignment Date" value={diet.assignmentDate ? formatDate(diet.assignmentDate) : 'Not available'} />
      <InfoRow label="Total Calories" value={`${diet.caloriasTotales} kcal`} />
      <InfoRow label="Objective/Description" value={diet.descripcion} />
      <InfoRow label="Estimated Duration" value={diet.estimatedDuration} />
      <InfoRow label="Next Review Date" value={diet.nextReviewDate ? formatDate(diet.nextReviewDate) : 'Not available'} />
      <InfoRow label="Notes" value={diet.notes} />
    </ScrollView>
  );
}
