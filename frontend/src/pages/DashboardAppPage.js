import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, TextField, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer'
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { contentOptions } from '../utils/constants';
import { pdfToText, generateCoverLetterPDF } from '../utils/pdf';
import './DashboardAppPage.css'

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [jobDescription, setJobDescription] = useState();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(contentOptions.COVER_LETTER);
  const [content, setContent] = useState(selectedContent.defaultText);
  const [openSnackbar, setOpenSnackar] = useState(false);
  const [error, setError] = useState("fdsalkfjlsdakj");

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
        const message = window.atob(res.data.message)
        console.log(message)
        setContent(message)
      }).catch(err => {
        setError(err)
      }).finally(() => {
        setLoading(false)
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
          <div className='title'>I want to write a ...</div>
          <TextField
            label="Content type"
            select
            defaultValue={selectedContent.title}
            helperText="Please select the content type"
          >
            {Object.values(contentOptions).map((option) => (
              <MenuItem key={option.enum} value={option.title} onClick={() => setSelectedContent(option)}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          
          <div className="fileUpload wrapper">
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
              {content.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)}
            </div>
            {content !== selectedContent.defaultText &&
              <div className='button-container'>
                <PDFDownloadLink document={generateCoverLetterPDF(content)}fileName="CoverLetter.pdf">
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
        <Snackbar
          anchorOrigin={{ vertical:'top', horizontal:"right" }}
          open={openSnackbar}
          onClose={() => setOpenSnackar(false)}
          message={error}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </div>
    </>
  );
}
