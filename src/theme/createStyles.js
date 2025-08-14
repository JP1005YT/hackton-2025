import { StyleSheet } from 'react-native';

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.large
    },
    title: {
      fontSize: theme.fontSize.title,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.medium
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      borderRadius: 8,
      padding: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      color: theme.colors.textPrimary
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: 10,
      marginTop: theme.spacing.small
    },
    buttonText: {
      color: theme.colors.buttonText,
      textAlign: 'center',
      fontWeight: '600'
    }
  });
