import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { LoadingState } from '../components/LoadingState';
import { API_URL } from '../api/config';
import { updatePatientProfile } from '../api/fitNutritionApi';
import { useAuth } from '../context/AuthContext';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/globalStyles';
import type { Patient } from '../types/models';

type EditFormState = {
  nombrePaciente: string;
  apellidosPaciente: string;
  email: string;
  telefono: string;
  domicilio: string;
  peso: string;
  estatura: string;
  talla: string;
};

function toNumberInput(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function ProfileScreen() {
  const { patient, isLoading, error, reload, token } = usePatientProfile();
  const { signOut } = useAuth();
  const [isEditing, setEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    nombrePaciente: '',
    apellidosPaciente: '',
    email: '',
    telefono: '',
    domicilio: '',
    peso: '',
    estatura: '',
    talla: '',
  });

  const uploadsBaseUrl = useMemo(() => API_URL.replace(/\/api\/?$/, ''), []);

  const handleOpenEditor = () => {
    if (!patient) return;
    setForm({
      nombrePaciente: patient.nombrePaciente ?? '',
      apellidosPaciente: patient.apellidosPaciente ?? '',
      email: patient.email ?? '',
      telefono: patient.telefono ?? '',
      domicilio: patient.domicilio ?? '',
      peso: `${patient.peso ?? ''}`,
      estatura: `${patient.estatura ?? ''}`,
      talla: `${patient.talla ?? ''}`,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!patient) return;
    setSaving(true);
    try {
      const payload: Partial<Patient> = {
        nombrePaciente: form.nombrePaciente.trim() || patient.nombrePaciente,
        apellidosPaciente: form.apellidosPaciente.trim() || patient.apellidosPaciente,
        email: form.email.trim() || patient.email,
        telefono: form.telefono.trim() || patient.telefono,
        domicilio: form.domicilio.trim() || patient.domicilio,
        peso: toNumberInput(form.peso.trim(), patient.peso),
        estatura: toNumberInput(form.estatura.trim(), patient.estatura),
        talla: toNumberInput(form.talla.trim(), patient.talla),
      };

      await updatePatientProfile(patient.idPaciente, payload, token);
      await reload();
      setEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron actualizar los datos del paciente.';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

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
            overflow: 'hidden',
            width: 112,
          }}
        >
          {patient.fotografia ? (
            <Image
              source={{
                uri: `${uploadsBaseUrl}/uploads/ver/${patient.fotografia}`,
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              }}
              style={{ height: 112, width: 112 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={92} color={colors.primaryDark} />
          )}
        </View>
        <Text style={[globalStyles.title, { fontSize: 24, marginTop: 10 }]}>
          {patient.nombrePaciente} {patient.apellidosPaciente}
        </Text>
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

      <AppButton title="Editar Información" onPress={handleOpenEditor} />
      <AppButton title="Cerrar Sesión" variant="danger" onPress={signOut} style={{ marginTop: 12 }} />

      <Modal animationType="slide" transparent visible={isEditing} onRequestClose={() => setEditing(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', padding: 20, justifyContent: 'center' }}>
          <View style={[globalStyles.card, { marginBottom: 0 }]}>
            <Text style={globalStyles.sectionTitle}>Editar Informacion</Text>

            <Text style={globalStyles.label}>Nombre</Text>
            <TextInput
              value={form.nombrePaciente}
              onChangeText={(value) => setForm((prev) => ({ ...prev, nombrePaciente: value }))}
              style={globalStyles.input}
              placeholder="Nombre"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Apellidos</Text>
            <TextInput
              value={form.apellidosPaciente}
              onChangeText={(value) => setForm((prev) => ({ ...prev, apellidosPaciente: value }))}
              style={globalStyles.input}
              placeholder="Apellidos"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Correo electronico</Text>
            <TextInput
              value={form.email}
              onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
              style={globalStyles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Telefono</Text>
            <TextInput
              value={form.telefono}
              onChangeText={(value) => setForm((prev) => ({ ...prev, telefono: value }))}
              style={globalStyles.input}
              keyboardType="phone-pad"
              placeholder="Telefono"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Domicilio</Text>
            <TextInput
              value={form.domicilio}
              onChangeText={(value) => setForm((prev) => ({ ...prev, domicilio: value }))}
              style={globalStyles.input}
              placeholder="Domicilio"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Peso (kg)</Text>
            <TextInput
              value={form.peso}
              onChangeText={(value) => setForm((prev) => ({ ...prev, peso: value }))}
              style={globalStyles.input}
              keyboardType="decimal-pad"
              placeholder="Peso"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Estatura (m)</Text>
            <TextInput
              value={form.estatura}
              onChangeText={(value) => setForm((prev) => ({ ...prev, estatura: value }))}
              style={globalStyles.input}
              keyboardType="decimal-pad"
              placeholder="Estatura"
              placeholderTextColor={colors.muted}
            />

            <Text style={[globalStyles.label, { marginTop: 12 }]}>Talla</Text>
            <TextInput
              value={form.talla}
              onChangeText={(value) => setForm((prev) => ({ ...prev, talla: value }))}
              style={globalStyles.input}
              keyboardType="number-pad"
              placeholder="Talla"
              placeholderTextColor={colors.muted}
            />

            <View style={{ marginTop: 16 }}>
              <AppButton title={isSaving ? 'Guardando...' : 'Guardar cambios'} onPress={handleSave} disabled={isSaving} />
              <AppButton title="Cancelar" variant="secondary" onPress={() => setEditing(false)} style={{ marginTop: 12 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
