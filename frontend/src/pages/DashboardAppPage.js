import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { pdfToText } from '../utils/pdf';
import './DashboardAppPage.css'

// ----------------------------------------------------------------------
export default function DashboardAppPage() {
  // const theme = useTheme();
  const [jobDescription, setJobDescription] = useState();
  const [resumeText, setResumeText] = useState();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)

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
          setLoading(true)
          axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
            resume: resumeText,
            desc: jobDescription,
          }).then(res => {
            console.log(res.data.message)
            setLoading(false)
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
      <div className='fullPage' style={{display:'flex', flexDirection:'row', alignItems:'center', gap: '1rem'}}>
      <div style={{display:'flex', gap:'1.5rem', flexDirection:'column'}}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <div className="fileUpload wrapper" style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '5px',
        }}>
                <AttachFileIcon/>
                <div> {file==null ? "Attach Resume/CV":`${file.name}`} </div>
                <input type="file" onChange={handleFileChange} className="custom-file-upload"/>
        </div>
        <div>
          <TextField
          id="outlined-multiline-static"
          label="Job Description"
          multiline
          rows={12}
          style = {{width:'25rem'}}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <Button variant="contained" onClick={handleGenerate} style={{width:'8rem'}}>
            Generate
        </Button>

      </div>
      <div className='CoverletterHolder'>
          {loading && <CircularProgress style={{alignSelf:'center'}}/>}
      </div>
      </div>
    </>
  );
}
