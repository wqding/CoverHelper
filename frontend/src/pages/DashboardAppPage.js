import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Button } from '@mui/material';

import axios from 'axios';

import { pdfToText } from '../utils/pdf';

// ----------------------------------------------------------------------
export default function DashboardAppPage() {
  // const theme = useTheme();
  const [jobDescription, setJobDescription] = useState();
  const [resumeText, setResumeText] = useState();
  const [file, setFile] = useState();

  const parsePDF = (file) => {
    if (file.type !== 'application/pdf') {
      console.log("Error: resume must be a pdf file");
      return
    }
  
    const fr=new FileReader();
    fr.onload= () => {
        pdfToText(fr.result, null, (text) => {
          setResumeText(text);
          console.log(process.env.REACT_APP_BASE_URL)

          axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
            resume: resumeText,
            desc: jobDescription,
          }).then(res => {
            console.log(res.data.message)
          });
        });
    }
    fr.readAsDataURL(file)
  }

  const handleGenerate = (e) => {
    if (!file) {
      console.log("Error: Resume must be a pdf format")
      return
    }

    parsePDF(file)
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | CoverHelper </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <input type="file" onChange={handleFileChange} />
        <div>{file && `${file.name}`}</div>
        <div>
          <div> Job Description: </div>
          <textarea 
            style = {{width:'25rem', height: '20rem', resize: 'none', outline: 'none'}}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <Button variant="contained" onClick={handleGenerate}>
            Generate
        </Button>

      </Container>
    </>
  );
}
