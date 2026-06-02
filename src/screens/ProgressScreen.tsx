import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

export function ProgressScreen({ navigation }: Props) {
  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.centered}>
        <Ionicons name="trending-up-outline" size={64} color={colors.primaryDark} />
        <Text style={globalStyles.title}>Progress</Text>
        <View style={{ gap: 12, width: '100%' }}>
          <AppButton title="Latest Measurement" onPress={() => navigation.navigate('LatestMeasurement')} />
          <AppButton title="Progress History" onPress={() => navigation.navigate('ProgressHistory')} variant="secondary" />
        </View>
      </View>
    </View>
  );
}
