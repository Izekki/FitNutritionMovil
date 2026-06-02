import { useCallback, useEffect, useState } from 'react';

import { getProfile } from '../api/fitNutritionApi';
import { useAuth } from '../context/AuthContext';
import type { Patient } from '../types/models';

export function usePatientProfile() {
  const { patient, setPatient, token, usuario } = useAuth();
  const [data, setData] = useState<Patient | null>(patient);
  const [isLoading, setLoading] = useState(!patient);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!usuario?.idUsuario) {
      setError('No logged-in user was found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await getProfile(usuario.idUsuario, token);
      setData(result);
      setPatient(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load patient data.');
    } finally {
      setLoading(false);
    }
  }, [setPatient, token, usuario?.idUsuario]);

  useEffect(() => {
    if (patient) {
      setData(patient);
      setLoading(false);
      return;
    }

    load();
  }, [load, patient]);

  return { patient: data, isLoading, error, reload: load, token };
}
