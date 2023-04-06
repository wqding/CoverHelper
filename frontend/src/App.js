import ReactGA from "react-ga"
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';


// ----------------------------------------------------------------------

const TRACKING_ID = "UA-244489217-2";
ReactGA.initialize(TRACKING_ID);

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
