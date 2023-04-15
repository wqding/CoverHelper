import ReactGA from "react-ga4";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';


// ----------------------------------------------------------------------

const MEASUREMENT_ID = "G-CF5MX1V72X";
ReactGA.initialize(MEASUREMENT_ID);

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
