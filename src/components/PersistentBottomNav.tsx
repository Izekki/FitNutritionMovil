import { Ionicons } from '@expo/vector-icons';
import type { NavigationContainerRef } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types/navigation';

type Props = {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList>>;
};

const shortcuts: Array<{
  label: string;
  route: keyof RootStackParamList;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { label: 'Perfil', route: 'Profile', icon: 'person-outline' },
  { label: 'Citas', route: 'Appointments', icon: 'calendar-outline' },
  { label: 'Dietas', route: 'Diets', icon: 'nutrition-outline' },
  { label: 'Progreso', route: 'Progress', icon: 'trending-up-outline' },
];

export function PersistentBottomNav({ navigationRef }: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        flexDirection: 'row',
        minHeight: 72,
        paddingHorizontal: 6,
        paddingTop: 8,
      }}
    >
      {shortcuts.map((item) => (
        <Pressable
          accessibilityRole="button"
          key={item.route}
          onPress={() => navigationRef.current?.navigate(item.route as never)}
          style={({ pressed }) => ({
            alignItems: 'center',
            flex: 1,
            gap: 4,
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name={item.icon} size={23} color={colors.primaryDark} />
          <Text numberOfLines={1} style={{ color: colors.primaryDark, fontSize: 12, fontWeight: '700' }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
