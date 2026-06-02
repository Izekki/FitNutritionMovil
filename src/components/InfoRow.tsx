import { Text, View } from 'react-native';

import { globalStyles } from '../theme/globalStyles';

type Props = {
  label: string;
  value?: string | number | null;
};

export function InfoRow({ label, value }: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={globalStyles.label}>{label}</Text>
      <Text style={globalStyles.value}>{value ?? 'No disponible'}</Text>
    </View>
  );
}
