import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import { getDietHistory } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Diet } from '../types/models';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DietHistory'>;

export function DietHistoryScreen({ navigation }: Props) {
  const { patient, token, isLoading: isPatientLoading, error: patientError, reload } = usePatientProfile();
  const [diets, setDiets] = useState<Diet[] | null>(null);
  const [error, setError] = useState('');

  async function loadDiets() {
    if (!patient?.idPaciente) return;
    setError('');
    try {
      const result = await getDietHistory(patient.idPaciente, token);
      setDiets(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load diet history.');
    }
  }

  useEffect(() => {
    loadDiets();
  }, [patient?.idPaciente, token]);

  if (patientError) {
    return <ErrorState message={patientError} onRetry={reload} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDiets} />;
  }

  if (isPatientLoading || !diets) {
    return <LoadingState />;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      {diets.map((diet) => (
        <Pressable
          key={diet.idDieta}
          onPress={() => navigation.navigate('DietDetail', { dietId: diet.idDieta, diet })}
          style={({ pressed }) => [globalStyles.card, pressed && { opacity: 0.76 }]}
        >
          <Text style={globalStyles.value}>{diet.nombreDieta} - {diet.caloriasTotales} kcal</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
