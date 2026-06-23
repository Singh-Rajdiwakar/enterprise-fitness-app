export const colors = {
  background: '#020617',
  backgroundDeep: '#000000',
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  accent: '#93C5FD',
  text: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.62)',
  textDim: 'rgba(255, 255, 255, 0.42)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassStrong: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.14)',
  danger: '#FCA5A5',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radii = {
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadows = {
  glass: {
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.28,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
};

export const typography = {
  eyebrow: {
    color: 'rgba(191, 219, 254, 0.78)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
};
