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
        <InfoRow label="Nombre" value={patient.nombrePaciente} />
        <InfoRow label="Apellidos" value={patient.apellidosPaciente} />
        <InfoRow label="Género" value={patient.genero} />
        <InfoRow label="Fecha de nacimiento" value={patient.fechaNacimiento} />
        <InfoRow label="Peso" value={`${patient.peso} kg`} />
        <InfoRow label="Estatura" value={`${patient.estatura} m`} />
        <InfoRow label="Talla" value={patient.talla} />
        <InfoRow label="Correo electrónico" value={patient.email} />
        <InfoRow label="Teléfono" value={patient.telefono} />
        <InfoRow label="Domicilio" value={patient.domicilio} />
        <InfoRow label="Médico Asignado" value={patient.medico ? `${patient.medico.nombreMedico} ${patient.medico.apellidosMedico}` : 'No asignado'} />
      </View>

      <AppButton title="Editar Información" onPress={() => Alert.alert('Editar Información', 'Esta acción es solo un marcador de posición de la interfaz.')} />
    </ScrollView>
  );
}
