import { useEffect } from 'react';
import ReactGA from "react-ga4";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';


// ----------------------------------------------------------------------

export default function App() {
  useEffect(() => {
    ReactGA.initialize("G-CF5MX1V72X");
  }, []);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
