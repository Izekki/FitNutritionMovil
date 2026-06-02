import { ReactNode } from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { globalStyles } from '../theme/globalStyles';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, onPress, variant = 'primary', disabled = false, icon, style }: Props) {
  const buttonStyle =
    variant === 'secondary' ? globalStyles.secondaryButton : variant === 'danger' ? globalStyles.dangerButton : globalStyles.primaryButton;
  const textStyle = variant === 'secondary' ? globalStyles.secondaryButtonText : globalStyles.buttonText;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [buttonStyle, style, disabled && { opacity: 0.5 }, pressed && { opacity: 0.82 }]}
    >
      {icon}
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}
