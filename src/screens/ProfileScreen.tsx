import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';

export function ProfileScreen() {
  const { patient, isLoading, error, reload } = usePatientProfile();

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (isLoading || !patient) {
    return <LoadingState />;
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContent} style={{ backgroundColor: colors.background }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 60,
            borderWidth: 1,
            height: 112,
            justifyContent: 'center',
            width: 112,
          }}
        >
          <Ionicons name="person-circle-outline" size={92} color={colors.primaryDark} />
        </View>
        <Text style={[globalStyles.title, { fontSize: 24, marginTop: 10 }]}>{patient.nombrePaciente} {patient.apellidosPaciente}</Text>
        <Text style={globalStyles.muted}>{patient.fotografia}</Text>
      </View>

      <View style={globalStyles.card}>
        <InfoRow label="First Name" value={patient.nombrePaciente} />
        <InfoRow label="Last Name" value={patient.apellidosPaciente} />
        <InfoRow label="Gender" value={patient.genero} />
        <InfoRow label="Date of Birth" value={patient.fechaNacimiento} />
        <InfoRow label="Weight" value={`${patient.peso} kg`} />
        <InfoRow label="Height" value={`${patient.estatura} m`} />
        <InfoRow label="Size/Waist" value={patient.talla} />
        <InfoRow label="Email" value={patient.email} />
        <InfoRow label="Phone" value={patient.telefono} />
        <InfoRow label="Address" value={patient.domicilio} />
        <InfoRow label="Assigned Doctor" value={patient.medico ? `${patient.medico.nombreMedico} ${patient.medico.apellidosMedico}` : 'Not assigned'} />
      </View>

      <AppButton title="Edit Information" onPress={() => Alert.alert('Edit Information', 'This action is a UI placeholder.')} />
    </ScrollView>
  );
}
