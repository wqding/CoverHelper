import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { IconButton, Button, TextField, MenuItem, CircularProgress, Snackbar, Alert, Slider, Box, Tooltip, Backdrop, ButtonGroup } from '@mui/material';
import { Add, Remove, FileCopy, AttachFile } from '@mui/icons-material';
import MoreHoriz from '@mui/icons-material/MoreVert';
import Clear from '@mui/icons-material/Clear';
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Buffer } from 'buffer';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer } from 'docx';

import { contentOptions, toneOptions } from '../utils/constants';
import { pdfToText, generatePDF } from '../utils/pdf';
import { IconMenu } from '../components/IconMenu';

import './DashboardAppPage.css'

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
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

    parsePDF(file, (resumeText) => {
      axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
        resume: resumeText,
        input,
        tone: toneValue,
        contentType: contentType.enum,
        recipientName,
        question,
      }).then(res => {
        const message = Buffer.from(res.data.message, 'base64').toString('utf8');
        setOutput(message)
      }).catch(err => {
        setSnackbarConfig({
          severity: "error",
          message: err.message,
        });
        setOpenSnackar(true);
      }).finally(() => {
        setLoading(false)
      });
    })
  };

  const handleDocxDownload = () => {
    // Create a new document
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

    // Generate and download the document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'coverletter.docx');
    });

    setSnackbarConfig({
      severity: "success",
      message: "Downloaded!",
    });
    setOpenSnackar(true);
  }

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
      case contentOptions.COLD_EMAIL.enum: return (<>
        <TextField
          label="Recipient's First Name (optional)"
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
      </>)
      case contentOptions.LINKEDIN_MESSAGE.enum: return (<>
        <TextField
          label="Recipient's First Name (optional)"
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
      </>)
      case contentOptions.CUSTOM_QUESTION_ANSWER.enum: return (<>
        <TextField
          label="Custom Question (ex. why do you want to work here?)"
          multiline
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <TextField
          label="Company/Job Description"
          multiline
          rows={12}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </>)
      default: return null;
    }
  };

  const changeContentType = (option) => {
    setContentType(option);
    setOutput(option.defaultText);
  };

  const handleDownload = () => {
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

  return (
    <>
      <Helmet>
        <title> CoverHelper </title>
      </Helmet>
      <div className='main'>
        <div className= 'leftSide' data-generated={openPreview}>
        <div className="input-elements-container">
          <div className='title'>Help me write a ...</div>
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
            <AttachFile/>
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
            style={{backgroundColor: canPreview ? '' : 'grey'}}>
            Preview
          </Button>
        </div>
        </div>
        <div className='rightSide' data-generated={openPreview}>
          <div className="clear-icon-container">
            <IconButton onClick={() => setOpenPreview(false)}>
              <Clear fontSize="large" style={{fill: "black"}}/>
            </IconButton>
          </div>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
            open={loading}
            component="rightSide"
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="page">
            <div className="page-content" ref={divRef} style={{
              fontSize: `${fontsize}px`,
            }}>
              {output.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)}
            </div>
            <div className="zoom-buttons-container">
              <Tooltip title="Zoom In" placement="top" arrow>
                <IconButton aria-label="increase font size" variant="contained" onClick={() => setFontsize(fontsize+1)}>
                  <Add />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out" placement="top" arrow>
                <IconButton aria-label="decrease font size" variant="contained" onClick={() => setFontsize(fontsize-1)}>
                  <Remove />
                </IconButton>
              </Tooltip>
            </div>
            {/* {output !== contentType.defaultText && */}
            <div className="buttons-container">
              <IconButton aria-label="copy" onClick={handleCopy}>
                <FileCopy />
              </IconButton>
              <IconMenu
                Icon={<MoreHoriz />} 
                MenuItems={[
                  <MenuItem onClick={handleDownload}><PDFDownloadLink document={generatePDF(output)} fileName="CoverHelper.pdf">Download PDF</PDFDownloadLink></MenuItem>,
                  <MenuItem onClick={handleDocxDownload}>Download Word Document</MenuItem>
                ]
                }
              />
              </div>
            {/* } */}
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
