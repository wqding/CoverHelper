import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Button } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [jobDescription, setJobDescription] = useState();

  const handleGenerate = (e) => {
    console.log(process.env.REACT_APP_BASE_URL)
      axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
        resume: "software engineer",
        desc: jobDescription,
      }).then(res => {
        console.log(res.data.message)
      });
  }

  return (
    <>
      <Helmet>
        <title> Dashboard | CoverHelper </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <div>
        <div> Job Description: </div>
        <textarea 
          style = {{width:'25rem', height: '20rem', resize: 'none', outline: 'none'}}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        </div>
        <Button href="" target="_blank" variant="contained" onClick={handleGenerate}>
            Generate
        </Button>

      </Container>
    </>
  );
}
