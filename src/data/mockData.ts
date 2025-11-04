import { MockData } from '../types/models';
import { colors } from '../theme/colors';

export const mockData: MockData = {
  sessions: [
    {
      name: 'Focus Inteligente',
      description: 'Bloquea redes sociales y notificaciones críticas',
      timeRange: '09:00 - 12:30',
      progress: 0.68,
      isActive: true,
      accentColor: colors.accentIndigo,
    },
    {
      name: 'Desconexión Nocturna',
      description: 'Preparación para dormir sin distracciones',
      timeRange: '22:00 - 07:00',
      progress: 0.15,
      isActive: false,
      accentColor: colors.accentPink,
    },
  ],
  usage: [
    {
      name: 'TimeLine',
      category: 'Social',
      used: 72, // 1h 12min in minutes
      limit: 45, // 45min
      changePercentage: -18,
      icon: 'chatbubbles',
      tint: colors.accentTeal,
    },
    {
      name: 'FocusMail',
      category: 'Productividad',
      used: 54,
      limit: 90,
      changePercentage: 12,
      icon: 'mail',
      tint: colors.accentIndigo,
    },
    {
      name: 'Mindful',
      category: 'Bienestar',
      used: 26,
      limit: 60,
      changePercentage: -5,
      icon: 'heart',
      tint: colors.accentPink,
    },
  ],
  schedules: [
    {
      name: 'Modo Trabajo',
      days: ['L', 'M', 'X', 'J'],
      timeRange: '08:30 - 17:30',
      isEnabled: true,
    },
    {
      name: 'Foco Profundo',
      days: ['L', 'M', 'X', 'J', 'V'],
      timeRange: '11:00 - 13:00',
      isEnabled: true,
    },
    {
      name: 'Descanso Digital',
      days: ['S', 'D'],
      timeRange: '21:00 - 09:00',
      isEnabled: false,
    },
  ],
  insights: [
    {
      title: 'Tiempo Productivo',
      subtitle: 'Semana actual',
      deltaDescription: '+1 h 12 min vs. semana pasada',
      highlight: 5.3,
      trend: 0.22,
    },
    {
      title: 'Distracciones Bloqueadas',
      subtitle: 'Hoy',
      deltaDescription: '18 apps limitadas en background',
      highlight: 18,
      trend: 0.35,
    },
    {
      title: 'Tiempo en Redes Sociales',
      subtitle: 'Promedio diario',
      deltaDescription: '-24% respecto a la media',
      highlight: 0.9,
      trend: -0.24,
    },
  ],
  profile: {
    name: 'Alex Rivera',
    role: 'Estratega UX',
    email: 'alex@focusstudio.com',
    avatarUrl: 'https://images.unsplash.com/photo-1531895861208-8504b98fe814?auto=format&fit=crop&w=200&q=60',
    notificationsEnabled: true,
    hapticFeedbackEnabled: true,
  },
};

