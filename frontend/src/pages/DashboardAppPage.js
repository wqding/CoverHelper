import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Button } from '@mui/material';

import * as PDFJS from 'pdfjs-dist';
import axios from 'axios';

// ----------------------------------------------------------------------
PDFJS.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';

export default function DashboardAppPage() {
  // const theme = useTheme();
  const [jobDescription, setJobDescription] = useState();
  const [file, setFile] = useState();

  const handleGenerate = (e) => {
    if (!file) {
      console.log("Error: No resume uploaded")
      return
    }

    const resumeText = parsePDF(file)

    axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
      resume: resumeText,
      desc: jobDescription,
    }).then(res => {
      console.log(res.data.message)
    });
  };

  const parsePDF = (file) => {
    if (file.type !== 'application/pdf') {
      console.log("not a pdf file");
      return
    }
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = PDFJS.getDocument(typedArray);
      console.log(pdf)
      
      pdf.then(pdf => {
        for (let i = 1; i <= pdf.numPages; i+=1) {
          pdf.getPage(i).then(page => {
            page.getTextContent().then(textContent => {
              console.log(textContent.items.map(item => item.str).join(''));
            });
          });
        }
      });
    });

    reader.readAsArrayBuffer(file);
  }

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
