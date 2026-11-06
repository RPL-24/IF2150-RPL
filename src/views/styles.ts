
import { StyleSheet } from 'react-native';

export const palette = {
  background: '#F4F7F5',
  white: '#FFFFFF',
  navy: '#172750',
  green: '#168343',
  brightGreen: '#54C65F',
  text: '#172750',
  secondary: '#64748B',
  border: '#D6DFE1',
  placeholder: '#64748B',
  disabled: '#DFE5E2',
  disabledText: '#64748B',
  error: '#C62828',
  errorBackground: '#FFF0EE',
  success: '#168343',
  successBackground: '#E8F6EB',
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },

  flex: {
    flex: 1,
  },

  authScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },

  pageHeader: {
    minHeight: 44,
    justifyContent: 'center',
  },

  pageHeaderWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },

  backButton: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  backText: {
    fontSize: 27,
    color: palette.navy,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: palette.navy,
  },

  brandCard: {
    minHeight: 250,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 22,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandLogo: {
    width: 190,
    height: 115,
    resizeMode: 'contain',
  },

  brandHeadline: {
    marginTop: 7,
    fontSize: 23,
    fontWeight: '800',
    color: palette.navy,
    textAlign: 'center',
  },

  brandSubtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: palette.secondary,
    textAlign: 'center',
  },

  form: {
    marginTop: 16,
  },

  fieldGroup: {
    marginBottom: 14,
  },

  fieldLabel: {
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '700',
    color: palette.navy,
  },

  input: {
    height: 50,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 13,
    backgroundColor: palette.white,
    fontSize: 15,
    color: palette.text,
  },

  inputError: {
    borderColor: palette.error,
  },

  passwordField: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 13,
    backgroundColor: palette.white,
  },

  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 13,
    fontSize: 15,
    color: palette.text,
  },

  passwordToggle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeShape: {
    width: 18,
    height: 12,
    borderWidth: 1.6,
    borderColor: palette.navy,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyePupil: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.navy,
  },

  eyeSlash: {
    position: 'absolute',
    width: 23,
    height: 1.7,
    backgroundColor: palette.navy,
    transform: [{ rotate: '45deg' }],
  },

  helperText: {
    marginTop: 5,
    fontSize: 11,
    color: palette.secondary,
  },

  fieldError: {
    marginTop: 5,
    fontSize: 12,
    color: palette.error,
  },

  errorPanel: {
    marginTop: 4,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: palette.errorBackground,
  },

  successPanel: {
    marginTop: 4,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: palette.successBackground,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },

  primaryButton: {
    height: 52,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  primaryButtonEnabled: {
    backgroundColor: palette.brightGreen,
  },

  primaryButtonDisabled: {
    backgroundColor: palette.disabled,
  },

  primaryButtonPressed: {
    opacity: 0.8,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.navy,
  },

  primaryButtonTextDisabled: {
    color: palette.disabledText,
  },

  forgotLink: {
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 17,
    fontSize: 14,
    fontWeight: '700',
    color: palette.green,
  },

  authLink: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    color: palette.navy,
  },

  authLinkGreen: {
    color: palette.green,
    fontWeight: '700',
  },

  authFooter: {
    marginTop: 'auto',
    paddingTop: 55,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    color: palette.secondary,
  },

  
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
    backgroundColor: palette.background,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: palette.navy,
  },

  error: {
    color: palette.error,
  },

  success: {
    color: palette.success,
  },

  link: {
    color: palette.green,
    textAlign: 'center',
    marginTop: 8,
  },
});
