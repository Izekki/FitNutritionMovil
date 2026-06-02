import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';

import { login } from '../api/fitNutritionApi';
import { AppButton } from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('ana.martinez@gmail.com');
  const [accessCode, setAccessCode] = useState('1234');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const response = await login(email, accessCode);
      signIn(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={globalStyles.screen}>
      <View style={[globalStyles.centered, { alignItems: 'stretch' }]}>
        <Text style={globalStyles.title}>Fit Nutrition</Text>
        <View style={{ gap: 12 }}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={globalStyles.input}
            value={email}
          />
          <TextInput
            keyboardType="number-pad"
            maxLength={4}
            onChangeText={setAccessCode}
            placeholder="Access Code"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={globalStyles.input}
            value={accessCode}
          />
        </View>
        {error ? <Text style={{ color: colors.danger, textAlign: 'center' }}>{error}</Text> : null}
        <AppButton disabled={isLoading || accessCode.length !== 4 || !email} onPress={handleLogin} title={isLoading ? 'Logging in...' : 'Login'} />
      </View>
    </KeyboardAvoidingView>
  );
}
