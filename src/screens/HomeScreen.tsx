import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';

export function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.centered}>
        <Ionicons name="leaf-outline" size={68} color={colors.primaryDark} />
        <Text style={globalStyles.title}>Fit Nutrition</Text>
        <View style={{ gap: 12, width: '100%' }}>
          <AppButton title="Perfil" onPress={() => navigation.navigate('ProfileTab')} />
          <AppButton title="Citas" onPress={() => navigation.navigate('AppointmentsTab')} />
          <AppButton title="Dietas" onPress={() => navigation.navigate('DietsTab')} />
          <AppButton title="Progreso" onPress={() => navigation.navigate('ProgressTab')} />
        </View>
      </View>
    </View>
  );
}
