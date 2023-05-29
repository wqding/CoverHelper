import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


export default function PricingPage() {
  return <>
    <Helmet>
      <title> Pricing | CoverHelper </title>
    </Helmet>

    <Container>
      <Typography variant="h4" gutterBottom>
        Pricing
      </Typography>
      <stripe-pricing-table
        pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}/>;
    </Container>
  </>
};