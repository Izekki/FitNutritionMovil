import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Fit Nutrition',
  slug: 'fit-nutrition',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'fitnutrition',
  plugins: ['expo-asset'],
  extra: {
    apiUrl: process.env.API_URL ?? 'http://localhost:3000/api',
  },
};

export default config;
