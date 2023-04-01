import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import AttachFile from '@mui/icons-material/AttachFile';
import Clear from '@mui/icons-material/Clear';

import { Buffer } from 'buffer';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer } from 'docx';

import { contentOptions, toneOptions } from '../utils/constants';
import { pdfToText } from '../utils/pdf';
import { ZoomButtons } from '../components/ZoomButtons';
import { ContentActionButtons } from '../components/ContentActionButtons';

import './DashboardAppPage.css'

export default function DashboardAppPage() {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [canPreview, setCanPreview] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState({
    severity: "success",
    message: "",
  });

  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState(contentOptions.COVER_LETTER);
  const [toneValue, setToneValue] = useState(100);
  const [recipientName, setRecipientName] = useState("");
  const [output, setOutput] = useState(contentType.defaultText);
  const [question, setQuestion] = useState("");

  const divRef = useRef(null);
  const [fontsize, setFontsize] = useState(window.innerWidth >= 968 ? 12 : 8);

  useEffect(() => {
    function handleResize() {
      if (divRef.current === null) {
        return;
      }
      const { offsetWidth } = divRef.current;

      setFontsize(Math.max(Math.ceil(0.029 * offsetWidth), 8));
    }
    window.addEventListener('resize', handleResize)
  }, [divRef])

  const parsePDF = (file, onParsed) => {
    if (file.type !== 'application/pdf') {
      setSnackbarConfig({
        severity: "error",
        message: "Error: resume must be a pdf file",
      });
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

  const sendGenerateRequest = (resumeText) => {
    if (input === "") {
      setSnackbarConfig({
        severity: "error",
        message: "Error: Job/Company Description cannot be empty",
      });
      setOpenSnackar(true);
      return;
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
      resume: resumeText,
      input,
      tone: toneValue,
      contentType: contentType.enum,
      recipientName,
      question,
    }).then(res => {
      const message = Buffer.from(res.data.message, 'base64').toString('utf8');
      setOutput(message);
    }).catch(err => {
      setSnackbarConfig({
        severity: "error",
        message: err.message,
      });
      setOpenSnackar(true);
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleGenerate = () => {
    if (!file) {
      setSnackbarConfig({
        severity: "error",
        message: "Error: Resume must be a pdf format",
      });
      setOpenSnackar(true);
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    setOpenPreview(true);
    setCanPreview(true);

    parsePDF(file, sendGenerateRequest);
  };

  const handleDocxDownload = () => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph(output),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'coverletter.docx');
    });

    setSnackbarConfig({
      severity: "success",
      message: "Downloaded!",
    });
    setOpenSnackar(true);
  };

  

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const changeContentType = (option) => {
    setContentType(option);
    setOutput(option.defaultText);
  };

  const handlePDFDownload = () => {
    setSnackbarConfig({
      severity: "success",
      message: "Downloaded!",
    });
    setOpenSnackar(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setSnackbarConfig({
      severity: "success",
      message: "Copied!",
    });
    setOpenSnackar(true);
  };

  const PageButtons = () => {
    return (
      <>
        <ZoomButtons fontsize={fontsize} setFontsize={setFontsize}/>
        {output !== contentType.defaultText && 
          <ContentActionButtons 
            output={output}
            handleCopy={handleCopy}
            handlePDFDownload={handlePDFDownload}
            handleDocxDownload={handleDocxDownload}
          />
        }
      </>
    )
  }

  const ContentInputSwitch = () => {
    switch (contentType.enum) {
      case contentOptions.COVER_LETTER.enum: return (
        <TextField
          label="Job Description"
          placeholder='e.g. "We are looking for a software engineer that sing and dance."'
          multiline
          rows={14}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )
      case contentOptions.LETTER_OF_INTENT.enum: return (
        <TextField
          label="Company Description (can be found on their website)"
          placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
          multiline
          rows={14}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )
      case contentOptions.COLD_EMAIL.enum: return (<>
        <TextField
          label="Recipient's First Name (optional)"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
        <TextField
          label="Company Description (can be found on their website)"
          placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
          multiline
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </>)
      case contentOptions.LINKEDIN_MESSAGE.enum: return (<>
        <TextField
          label="Recipient's First Name (optional)"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
        <TextField
          label="Company Description (can be found on their website)"
          placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
          multiline
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </>)
      case contentOptions.CUSTOM_QUESTION_ANSWER.enum: return (<>
        <TextField
          label="Custom Question (e.g. why do you want to work here?)"
          multiline
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <TextField
          label="Company/Job Description"
          placeholder='e.g. "We are a startup that is building a new social media platform to connect plant owners."'
          multiline
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </>)
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        <title> CoverHelper </title>
      </Helmet>
      <div className='main' style={{height: window.innerHeight}}>
        <div className= 'leftSide' data-generated={openPreview}>
        <div className="input-elements-container">
          <div className='title'>Help me write a ...</div>
          <TextField
            label="Content type"
            select
            defaultValue={contentType.title}
            helperText="Please select the content type"
            sx={{minWidth: "35%"}}
          >
            {Object.values(contentOptions).map((option) => (
              <MenuItem key={option.enum} value={option.title} onClick={() => changeContentType(option)}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          
          <Button variant="contained" startIcon={<AttachFile/>} sx={{minWidth: "35%", height: '3rem'}} component="label">
            {file==null ? "Upload Resume/CV":`${file.name}`}
            <input hidden type="file" onChange={handleFileChange}/>
          </Button>

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
        </div>
        <div className='buttons-container'>
          <Button variant="contained" onClick={handleGenerate}>
            {loading ? 'Loading...' : 'Generate'}
          </Button>
          <Button 
            className='preview' 
            variant="contained" 
            onClick={() => {if(canPreview){
              setOpenPreview(true);
            }}}
            disabled={!canPreview}>
            Preview
          </Button>
        </div>
        </div>
        <div className='rightSide' data-generated={openPreview}>
          <div className="clear-icon-container">
            <IconButton onClick={() => setOpenPreview(false)} sx={{zIndex: 3, color: 'white', backgroundColor: theme.palette.grey[500]}}>
              <Clear/>
            </IconButton>
          </div>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
            open={loading}
            component="rightSide"
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {window.innerWidth <= 1000 && PageButtons()}
          <div className="page">
            <div className="page-content" ref={divRef} style={{
              fontSize: `${fontsize}px`,
            }}>
              {output.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)}
            </div>
            {window.innerWidth > 1000 && PageButtons()}
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical:'top', horizontal:"right" }}
          open={openSnackbar}
          onClose={() => setOpenSnackar(false)}
          message={snackbarConfig.message}
          autoHideDuration={2000}
        >
          <Alert severity={snackbarConfig.severity} onClose={() => setOpenSnackar(false)}>{snackbarConfig.message}</Alert>
        </Snackbar>
      </div>
    </>
  );
}
