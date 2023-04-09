import ReactGA from "react-ga4";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';


// ----------------------------------------------------------------------

const MEASUREMENT_ID = "G-WL3Z4V4M82";
ReactGA.initialize(MEASUREMENT_ID);

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
