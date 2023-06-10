import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// @mui
// import Grid from "@mui/material";
// import Button from "@mui/material";
import Container from "@mui/material/Container";
// import Stack from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export default function LandingPage() {
    return (
      <>
        <Helmet>
          <title> Welcome | CoverHelper </title>
        </Helmet>
        <Container>
            <Typography variant="h4" gutterBottom>
                LandingPage
            </Typography>
            <Button component={Link} to="/app" variant="contained" color="primary">
                Get started
            </Button>
        </Container>
      </>
    );
  }
  