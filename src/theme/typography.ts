import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  largeTitle: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  title: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },
  callout: {
    fontFamily,
    fontSize: 17,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: -0.1,
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.1,
  },
  footnote: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.08,
  },
};
