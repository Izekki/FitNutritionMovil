import { ActivityIndicator, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';

export function LoadingState() {
  return (
    <View style={globalStyles.centered}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={globalStyles.muted}>Cargando...</Text>
    </View>
  );
}
