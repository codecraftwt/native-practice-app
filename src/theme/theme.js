export const colors = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primarySoft: '#EEF2FF',

  accent: '#F59E0B',
  accentSoft: '#FEF3C7',

  success: '#10B981',
  successSoft: '#D1FAE5',

  warning: '#F59E0B',
  warningSoft: '#FEF3C7',

  danger: '#EF4444',
  dangerSoft: '#FEE2E2',

  info: '#3B82F6',
  infoSoft: '#DBEAFE',

  bg: '#F6F7FB',
  surface: '#FFFFFF',
  border: '#ECEEF5',

  text: '#0F172A',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  float: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primary: {
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
};

export const statusTheme = {
  PLACED: { bg: colors.infoSoft, fg: '#1D4ED8' },
  PREPARING: { bg: colors.warningSoft, fg: '#B45309' },
  COOKING: { bg: colors.warningSoft, fg: '#B45309' },
  READY: { bg: colors.successSoft, fg: '#047857' },
  SERVED: { bg: colors.successSoft, fg: '#047857' },
  COMPLETED: { bg: colors.successSoft, fg: '#047857' },
  CANCELLED: { bg: colors.dangerSoft, fg: '#B91C1C' },
  AVAILABLE: { bg: colors.successSoft, fg: '#047857' },
  OCCUPIED: { bg: colors.dangerSoft, fg: '#B91C1C' },
  RESERVED: { bg: colors.infoSoft, fg: '#1D4ED8' },
};

export default { colors, spacing, radius, shadow, statusTheme };
