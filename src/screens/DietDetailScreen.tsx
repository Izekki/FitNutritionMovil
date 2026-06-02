import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { getDietDetail } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Diet } from '../types/models';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DietDetail'>;
const mealOrder = ['Breakfast', 'Mid-day', 'Lunch', 'Dinner'] as const;

export function DietDetailScreen({ route }: Props) {
  const { token } = useAuth();
  const [diet, setDiet] = useState<Diet | null>(route.params.diet ?? null);
  const [error, setError] = useState('');

  async function loadDiet() {
    if (!route.params.diet) {
      setError('');
      try {
        const result = await getDietDetail(route.params.dietId, token);
        setDiet(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load diet detail.');
      }
    }
  }

  useEffect(() => {
    loadDiet();
  }, [route.params.diet, route.params.dietId]);

  const groupedFoods = useMemo(() => {
    if (!diet) return {};
    return diet.foods.reduce<Record<string, typeof diet.foods>>((groups, food) => {
      groups[food.mealTime] = [...(groups[food.mealTime] ?? []), food];
      return groups;
    }, {});
  }, [diet]);

  if (error) {
    return <ErrorState message={error} onRetry={loadDiet} />;
  }

  if (!diet) {
    return <LoadingState />;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <View style={globalStyles.card}>
        <InfoRow label="Name" value={diet.nombreDieta} />
        <InfoRow label="Total Calories" value={`${diet.caloriasTotales} kcal`} />
        <InfoRow label="Description" value={diet.descripcion} />
      </View>

      <Text style={globalStyles.sectionTitle}>Foods</Text>
      {mealOrder.map((meal) => {
        const foods = groupedFoods[meal] ?? [];
        if (!foods.length) return null;

        return (
          <View key={meal} style={globalStyles.card}>
            <Text style={[globalStyles.value, { marginBottom: 10 }]}>{meal}</Text>
            {foods.map((food) => (
              <View key={`${meal}-${food.idAlimento}`} style={{ marginBottom: 10 }}>
                <Text style={globalStyles.body}>{food.nombreAlimento}</Text>
                <Text style={globalStyles.muted}>{food.porcion} - {food.caloriasPorcion} kcal</Text>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}
