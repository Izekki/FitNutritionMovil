import type { Diet } from './models';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Appointments: undefined;
  AppointmentDetail: { appointmentId: number };
  Diets: undefined;
  CurrentDiet: undefined;
  DietHistory: undefined;
  DietDetail: { dietId: number; diet?: Diet };
  Progress: undefined;
  LatestMeasurement: undefined;
  ProgressHistory: undefined;
};

export type AuthTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  AppointmentsTab: undefined;
  DietsTab: undefined;
  ProgressTab: undefined;
};
