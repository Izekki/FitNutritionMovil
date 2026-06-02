import { Text, View } from 'react-native';

import { AppButton } from './AppButton';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={globalStyles.centered}>
      <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>{message}</Text>
      {onRetry ? <AppButton title="Retry" onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
}
