export function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`));
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}

export function canCancelAppointment(fecha: string, hora: string, now = new Date()) {
  const appointmentDate = new Date(`${fecha}T${hora}`);
  const diffMs = appointmentDate.getTime() - now.getTime();
  return diffMs >= 60 * 60 * 1000;
}
