import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer'
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { pdfToText, generateCoverLetterPDF } from '../utils/pdf';
import './DashboardAppPage.css'

const DEFAULT_TEXT = "Dear Hiring Manager,\n\n..."

// ----------------------------------------------------------------------
export default function DashboardAppPage() {
  const [jobDescription, setJobDescription] = useState();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coverletter, setCoverletter] = useState(DEFAULT_TEXT)

  const divRef = useRef(null);
  const [fontsize, setFontsize] = useState(12)

  useEffect(() => {
    function handleResize() {
      const { offsetWidth } = divRef.current;

      setFontsize(Math.floor(0.029 * offsetWidth));
    }
    window.addEventListener('resize', handleResize)
  }, [divRef.current])

  const parsePDF = (file, onParsed) => {
    if (file.type !== 'application/pdf') {
      console.log("Error: resume must be a pdf file");
      return
    }
  
    const fr=new FileReader();
    fr.onload= () => {
        pdfToText(fr.result, () => {}, (text) => {
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
        const message = window.atob(res.data.message)
        console.log(message)
        setCoverletter(message)
      });
    })
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Helmet>
        <title> CoverHelper </title>
      </Helmet>
      <div className='main'>
      <div className= 'leftSide'>
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
          rows={17}
          style = {{width:'100%', position:'relative'}}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button variant="contained" onClick={handleGenerate} style={{width:'8rem'}}>
          {loading ? 'Loading...' : 'Generate'}
        </Button>
      </div>
      <div className='rightSide'>
        <div className="page">
          {loading && <CircularProgress className='circle'/>}
          <div className="page-content" ref={divRef} style={{
            fontSize: `${fontsize}px`,
          }}>
            {coverletter.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)}
          </div>
          {coverletter !== DEFAULT_TEXT &&
            <div className='button-container'>
              <PDFDownloadLink document={generateCoverLetterPDF(coverletter)}fileName="CoverLetter.pdf">
                {({loading}) => 
                  loading ? (
                      <Button variant="contained" style={{width:'8rem'}}>Loading...</Button>
                  ) : (
                      <Button variant="contained" style={{width:'8rem'}}>Download</Button>
                  )
                }
              </PDFDownloadLink>
            </div>
          }
        </div>
      </div>
      </div>
    </>
  );
}
