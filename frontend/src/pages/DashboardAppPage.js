import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button } from '@mui/material';
import { PDFDownloadLink, Text, Document, Page } from '@react-pdf/renderer'
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { pdfToText } from '../utils/pdf';
import CLSection from '../components/cover-letter-section';
import './DashboardAppPage.css'

// ----------------------------------------------------------------------
export default function DashboardAppPage() {
  const [jobDescription, setJobDescription] = useState();
  const [resumeText, setResumeText] = useState();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [coverletter, setCoverletter] = useState(null)

  const parsePDF = (file, onParsed) => {
    if (file.type !== 'application/pdf') {
      console.log("Error: resume must be a pdf file");
      return
    }
  
    const fr=new FileReader();
    fr.onload= () => {
        pdfToText(fr.result, () => {}, (text) => {
          setResumeText(text);
          console.log(process.env.REACT_APP_BASE_URL)

          onParsed(text)
        });
    }
    fr.readAsDataURL(file)
  }

  const handleGenerate = (e) => {
    if (!file) {
      console.log("Error: Resume must be a pdf format")
      return
    }

    parsePDF(file, (resumeText) => {
      setLoading(true)
      axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
        resume: resumeText,
        desc: jobDescription,
      }).then(res => {
        setLoading(false)
        console.log(res.data.message)
        setCoverletter(res.data.message)
      });
    })
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const GeneratePDF = () =>(
        <Document>
        <Page>
            <Text>
            {coverletter}
            </Text>
        </Page>
        </Document>
  )

  return (
    <>
      <Helmet>
        <title> Dashboard | CoverHelper </title>
      </Helmet>
      <div className='CoverletterHolder'>
        {loading && <CircularProgress style={{alignSelf:'center'}}/>}
      </div>
      <Container maxWidth="xl" style={{display:'flex', gap:'1.5rem', position: 'fixed', top: '0px', bottom: '0px', width: '50%', flexDirection:'column'}}>
        <CLSection text={jobDescription}/>
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
        <TextField
          id="outlined-multiline-static"
          label="Job Description"
          multiline
          rows={12}
          style = {{width:'25rem'}}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button variant="contained" onClick={handleGenerate} style={{width:'8rem'}}>
            Generate
        </Button>
        {coverletter != null &&
          <div>
            <PDFDownloadLink document={<GeneratePDF/> }fileName="CoverLetter.pdf">
              {({loading}) => 
                loading ? (
                    <Button variant="contained" style={{width:'8rem'}}>Loading document...</Button>
                ) : (
                    <Button variant="contained" style={{width:'8rem'}}>Download now!</Button>
                )
              }
            </PDFDownloadLink>
          </div>
        }
      </Container>
    </>
  );
}
