import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getDietDetail } from '../api/fitNutritionApi';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Diet, FoodItem } from '../types/models';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DietDetail'>;

export function DietDetailScreen({ route, navigation }: Props) {
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
        setError(err instanceof Error ? err.message : 'No se pudo cargar el detalle de la dieta.');
      }
    }
  }

  useEffect(() => {
    loadDiet();
  }, [route.params.diet, route.params.dietId]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          accessibilityRole="button"
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Diets'))}
          style={{ alignItems: 'center', flexDirection: 'row', gap: 4, paddingHorizontal: 4, paddingVertical: 2 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Regresar</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const segmentedFoods = useMemo(() => {
    const sections = {
      Desayuno: [] as FoodItem[],
      MediaManana: [] as FoodItem[],
      Comida: [] as FoodItem[],
      Cena: [] as FoodItem[],
    };

    if (!diet || !diet.foods) return sections;

    diet.foods.forEach((food, index) => {
      if (index === 0) {
        sections.Desayuno.push(food);
      } else if (index === 1) {
        sections.Comida.push(food);
      } else if (index === 2) {
        sections.Cena.push(food);
      } else {
        sections.MediaManana.push(food);
      }
    });

    return sections;
  }, [diet]);

  if (error) {
    return <ErrorState message={error} onRetry={loadDiet} />;
  }

  if (!diet) {
    return <LoadingState />;
  }

  const sections = [
    { key: 'Desayuno', title: '🍳 Desayuno', foods: segmentedFoods.Desayuno },
    { key: 'MediaManana', title: '🍏 Media Mañana', foods: segmentedFoods.MediaManana },
    { key: 'Comida', title: '🥩 Comida', foods: segmentedFoods.Comida },
    { key: 'Cena', title: '🌙 Cena', foods: segmentedFoods.Cena },
  ];

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <View style={globalStyles.card}>
        <InfoRow label="Nombre de la dieta" value={diet.nombreDieta} />
        <InfoRow label="Total de kcal" value={`${diet.caloriasTotales} kcal`} />
        <InfoRow label="Descripción" value={diet.descripcion} />
        {diet.notes ? <InfoRow label="Observaciones" value={diet.notes} /> : null}
      </View>

      <Text style={globalStyles.sectionTitle}>Alimentos por tiempo de comida</Text>
      {sections.map((section) => (
        <View key={section.key} style={globalStyles.card}>
          <Text style={[globalStyles.value, { marginBottom: 10, fontWeight: '700' }]}>{section.title}</Text>
          {section.foods.length > 0 ? (
            section.foods.map((food, idx) => (
              <View key={`${section.key}-${food.idAlimento}-${idx}`} style={{ marginBottom: 10 }}>
                <Text style={globalStyles.body}>{food.nombreAlimento}</Text>
                <Text style={globalStyles.muted}>{food.porcion} - {food.caloriasPorcion} kcal</Text>
              </View>
            ))
          ) : (
            <Text style={[globalStyles.muted, { fontStyle: 'italic' }]}>No programado</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
