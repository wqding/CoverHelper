import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, TextField, MenuItem, CircularProgress, Snackbar, Alert, Slider, Box } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Buffer } from 'buffer';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { contentOptions, toneOptions } from '../utils/constants';
import { pdfToText, generatePDF } from '../utils/pdf';
import './DashboardAppPage.css'

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState(contentOptions.COVER_LETTER);
  const [toneValue, setToneValue] = useState(50);
  const [recipientName, setRecipientName] = useState("");
  const [output, setOutput] = useState(contentType.defaultText);

  const divRef = useRef(null);
  const [fontsize, setFontsize] = useState(12)

  useEffect(() => {
    function handleResize() {
      if (divRef.current === null) {
        return;
      }
      const { offsetWidth } = divRef.current;

      setFontsize(Math.floor(0.029 * offsetWidth));
    }
    window.addEventListener('resize', handleResize)
  }, [divRef.current])

  const parsePDF = (file, onParsed) => {
    if (file.type !== 'application/pdf') {
      setError("Error: resume must be a pdf file");
      setOpenSnackar(true);
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

  const handleGenerate = () => {
    if (!file) {
      setError("Error: Resume must be a pdf format");
      setOpenSnackar(true);
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);

    parsePDF(file, (resumeText) => {
      axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
        resume: resumeText,
        input,
        tone: toneValue,
        contentType: contentType.enum,
        recipientName,
      }).then(res => {
        console.log(res.data.message)
        const message = Buffer.from(res.data.message, 'base64').toString('utf8');
        setOutput(message)
      }).catch(err => {
        setError(err);
        setOpenSnackar(true);
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
  const ContentInputSwitch = () => {
    switch (contentType.enum) {
      case contentOptions.COVER_LETTER.enum: return (
        <TextField
          label="Job Description"
          multiline
          rows={17}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )
      case contentOptions.LETTER_OF_INTENT.enum: return (
        <TextField
          label="Company Description (can be found on their website)"
          multiline
          rows={17}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )
      case contentOptions.COLD_EMAIL.enum: return <>
        <TextField
          label="Recipient Name (optional)"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
        <TextField
          label="Company Description (can be found on their website)"
          multiline
          rows={12}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </>
      default: return null;
    }
  };

  const changeContentType = (option) => {
    setContentType(option);
    setOutput(option.defaultText);
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
            defaultValue={contentType.title}
            helperText="Please select the content type"
          >
            {Object.values(contentOptions).map((option) => (
              <MenuItem key={option.enum} value={option.title} onClick={() => changeContentType(option)}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          <div className="fileUpload wrapper">
            <AttachFileIcon/>
            <div> {file==null ? "Attach Resume/CV":`${file.name}`} </div>
            <input type="file" onChange={handleFileChange} className="custom-file-upload"/>
          </div>
          <Box sx={{ width: 300, margin: '0 auto'}}>
            <Slider
              aria-label="Tone slider"
              track={false}
              defaultValue={toneValue}
              step={null}
              onChange={(e, value) => setToneValue(value)}
              marks={toneOptions}
            />
          </Box>
          {ContentInputSwitch()}
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
              {output.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)}
            </div>
            {output !== contentType.defaultText &&
              <div className='button-container'>
                <PDFDownloadLink document={generatePDF(output)}fileName="CoverLetter.pdf">
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
