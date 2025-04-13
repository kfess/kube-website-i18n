import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { NavigationBar } from '@/features/NavigationBar';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <NavigationBar>
        <Router />
      </NavigationBar>
    </MantineProvider>
  );
}
