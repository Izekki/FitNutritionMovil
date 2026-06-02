import Constants from 'expo-constants';

type ExtraConfig = {
  apiUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const API_URL = extra.apiUrl ?? 'http://localhost:3000/api';
