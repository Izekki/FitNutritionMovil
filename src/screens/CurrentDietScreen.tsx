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
      setError(err instanceof Error ? err.message : 'No se pudo cargar la dieta actual.');
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
      <InfoRow label="Nombre" value={diet.nombreDieta} />
      <InfoRow label="Estado" value={diet.estatusEdicion} />
      <InfoRow label="Fecha de asignación" value={diet.assignmentDate ? formatDate(diet.assignmentDate) : 'No disponible'} />
      <InfoRow label="Calorías totales" value={`${diet.caloriasTotales} kcal`} />
      <InfoRow label="Objetivo" value={diet.descripcion} />
      <InfoRow label="Duración estimada" value={diet.estimatedDuration} />
      <InfoRow label="Próxima revisión" value={diet.nextReviewDate ? formatDate(diet.nextReviewDate) : 'No disponible'} />
      <InfoRow label="Observaciones" value={diet.notes} />
    </ScrollView>
  );
}
