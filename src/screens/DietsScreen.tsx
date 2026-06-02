import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Diets'>;

export function DietsScreen({ navigation }: Props) {
  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.centered}>
        <Ionicons name="nutrition-outline" size={64} color={colors.primaryDark} />
        <Text style={globalStyles.title}>Dietas</Text>
        <View style={{ gap: 12, width: '100%' }}>
          <AppButton title="Dieta actual" onPress={() => navigation.navigate('CurrentDiet')} />
          <AppButton title="Historial de dietas" onPress={() => navigation.navigate('DietHistory')} variant="secondary" />
        </View>
      </View>
    </View>
  );
}
