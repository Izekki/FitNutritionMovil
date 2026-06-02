import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppointmentsScreen } from './src/screens/AppointmentsScreen';
import { AppointmentDetailScreen } from './src/screens/AppointmentDetailScreen';
import { CurrentDietScreen } from './src/screens/CurrentDietScreen';
import { DietDetailScreen } from './src/screens/DietDetailScreen';
import { DietHistoryScreen } from './src/screens/DietHistoryScreen';
import { DietsScreen } from './src/screens/DietsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LatestMeasurementScreen } from './src/screens/LatestMeasurementScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ProgressHistoryScreen } from './src/screens/ProgressHistoryScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { colors } from './src/theme/colors';
import type { AuthTabParamList, RootStackParamList } from './src/types/navigation';

type LoginStackParamList = {
  Login: undefined;
};

type AppRootParamList = {
  AuthTabs: NavigatorScreenParams<AuthTabParamList>;
};

const LoginStack = createNativeStackNavigator<LoginStackParamList>();
const AppRootStack = createNativeStackNavigator<AppRootParamList>();
const Tab = createBottomTabNavigator<AuthTabParamList>();
const HomeStackNav = createNativeStackNavigator<RootStackParamList>();
const ProfileStackNav = createNativeStackNavigator<RootStackParamList>();
const AppointmentsStackNav = createNativeStackNavigator<RootStackParamList>();
const DietsStackNav = createNativeStackNavigator<RootStackParamList>();
const ProgressStackNav = createNativeStackNavigator<RootStackParamList>();

const stackOptions: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: colors.background },
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTitleAlign: 'center',
  headerTintColor: colors.text,
  headerBackTitleVisible: false,
};

function homeBackButton(navigation: any): NativeStackNavigationOptions {
  return {
    headerLeft: () => (
      <Pressable
        accessibilityRole="button"
        onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('HomeTab'))}
        style={{ alignItems: 'center', flexDirection: 'row', gap: 4, paddingHorizontal: 4, paddingVertical: 2 }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Regresar</Text>
      </Pressable>
    ),
  };
}

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackOptions}>
      <HomeStackNav.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </HomeStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={({ navigation }) => ({ ...stackOptions, ...homeBackButton(navigation) })}>
      <ProfileStackNav.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </ProfileStackNav.Navigator>
  );
}

function AppointmentsStack() {
  return (
    <AppointmentsStackNav.Navigator screenOptions={stackOptions}>
      <AppointmentsStackNav.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={({ navigation }) => ({ title: 'Citas', ...homeBackButton(navigation) })}
      />
      <AppointmentsStackNav.Screen name="AppointmentDetail" component={AppointmentDetailScreen} options={{ title: 'Detalle de cita' }} />
    </AppointmentsStackNav.Navigator>
  );
}

function DietsStack() {
  return (
    <DietsStackNav.Navigator screenOptions={stackOptions}>
      <DietsStackNav.Screen name="Diets" component={DietsScreen} options={({ navigation }) => ({ title: 'Dietas', ...homeBackButton(navigation) })} />
      <DietsStackNav.Screen name="CurrentDiet" component={CurrentDietScreen} options={{ title: 'Dieta actual' }} />
      <DietsStackNav.Screen name="DietHistory" component={DietHistoryScreen} options={{ title: 'Historial de dietas' }} />
      <DietsStackNav.Screen name="DietDetail" component={DietDetailScreen} options={{ title: 'Detalle de dieta' }} />
    </DietsStackNav.Navigator>
  );
}

function ProgressStack() {
  return (
    <ProgressStackNav.Navigator screenOptions={stackOptions}>
      <ProgressStackNav.Screen
        name="Progress"
        component={ProgressScreen}
        options={({ navigation }) => ({ title: 'Progreso', ...homeBackButton(navigation) })}
      />
      <ProgressStackNav.Screen name="LatestMeasurement" component={LatestMeasurementScreen} options={{ title: 'Última medición' }} />
      <ProgressStackNav.Screen name="ProgressHistory" component={ProgressHistoryScreen} options={{ title: 'Historial de progreso' }} />
    </ProgressStackNav.Navigator>
  );
}

function AuthTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          minHeight: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof AuthTabParamList, keyof typeof Ionicons.glyphMap> = {
            HomeTab: 'leaf-outline',
            ProfileTab: 'person-outline',
            AppointmentsTab: 'calendar-outline',
            DietsTab: 'nutrition-outline',
            ProgressTab: 'trending-up-outline',
          };

          return <Ionicons name={icons[route.name as keyof AuthTabParamList]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Perfil' }} />
      <Tab.Screen name="AppointmentsTab" component={AppointmentsStack} options={{ title: 'Citas' }} />
      <Tab.Screen name="DietsTab" component={DietsStack} options={{ title: 'Dietas' }} />
      <Tab.Screen name="ProgressTab" component={ProgressStack} options={{ title: 'Progreso' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppRootStack.Navigator screenOptions={{ headerShown: false }}>
          <AppRootStack.Screen name="AuthTabs" component={AuthTabs} />
        </AppRootStack.Navigator>
      ) : (
        <LoginStack.Navigator screenOptions={{ headerShown: false }}>
          <LoginStack.Screen name="Login" component={LoginScreen} />
        </LoginStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
