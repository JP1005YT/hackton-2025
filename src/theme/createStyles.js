import { useTheme } from './ThemeContext';

export const createStyles = (styleFunction) => {
  return () => {
    const { theme } = useTheme();
    return styleFunction(theme);
  };
};