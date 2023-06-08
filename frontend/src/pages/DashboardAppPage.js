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
import Clear from '@mui/icons-material/Clear';
import ReactGA from "react-ga4";

import { Buffer } from 'buffer';
import axios from 'axios';

import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue} from "firebase/database";
import { auth, database } from '../services/firebase';

import { contentOptions, toneOptions } from '../utils/constants';
import { downloadDocx } from '../utils/docx';
import { ZoomButtons } from '../components/ZoomButtons';
import { ContentActionButtons } from '../components/ContentActionButtons';
import { ContentInputSwitch } from '../components/ContentInputSwitch';
import { AlertDialog } from '../components/AlertDialog';
import { ResumeSelect } from '../components/ResumeSelect';
import { RegisterDialog } from '../components/RegisterDialog';
import { LoginDialog } from '../components/LoginDialog';

import './DashboardAppPage.css'

export default function DashboardAppPage() {
  ReactGA.send({ hitType: "pageview", page: "/app", title: "Main Page" });
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [canPreview, setCanPreview] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState({
    severity: "success",
    message: "",
  });
  const [fontsize, setFontsize] = useState(window.innerWidth >= 700 ? 12 : 9);

  const pageContentRef = useRef(null);

  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState(contentOptions.COVER_LETTER);
  const [toneValue, setToneValue] = useState(0);
  const [recipientName, setRecipientName] = useState("");
  const [output, setOutput] = useState(contentType.defaultText);
  const [question, setQuestion] = useState("");

  const [loggedIn, setLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [showLogin, setShowLogin] = useState(true);

  ReactGA.send({ hitType: "pageview", page: "/app", title: "Main Page" });

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true)

          const dbuser = ref(database, `users/${user.uid}`);
          onValue(dbuser, (snapshot) => {
            const data = snapshot.val()
            setUserData(data)
            if (data.resume) {
              setResumeData(data.resume)
            }
            setIsLoadingUser(false)
          });
        } else {
          // reset page state when logged out
          setLoggedIn(false);
          setUserData(null);
          setResumeData(null);
          setIsLoadingUser(true);
          setShowLogin(true);

          setInput("");
          setContentType(contentOptions.COVER_LETTER);
          setToneValue(0);
          setRecipientName("");
          setOutput(contentType.defaultText);
          setQuestion("");
        }
      });
     
  }, [])

  useEffect(() => {
    function handleResize() {
      if (pageContentRef.current === null) {
        return;
      }
      const { offsetWidth } = pageContentRef.current;

      setFontsize(Math.max(Math.ceil(0.029 * offsetWidth), 8));
    }
    window.addEventListener('resize', handleResize)
  }, [pageContentRef])

  const handleToggleDialog = () => {
    setShowLogin(!showLogin);
  };

  const sendGenerateRequest = () => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
      resume: resumeData.text,
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
    if (!resumeData || resumeData.text.length < 20) {
      setSnackbarConfig({
        severity: "error",
        message: "Error: Invalid resume, ensure your resume is uploaded and is a highlightable pdf",
      });
      setOpenSnackar(true);
      return;
    }
    if (input === "") {
      setSnackbarConfig({
        severity: "error",
        message: "Error: Job/Company Description cannot be empty",
      });
      setOpenSnackar(true);
      return;
    }
    if (loading || uploading) {
      return;
    }
    ReactGA.event({
      category: 'User',
      action: 'Click Generate'
    })
    setLoading(true);
    setOpenPreview(true);
    setCanPreview(true);

    sendGenerateRequest();
  };

  const handleDocxDownload = () => {
    downloadDocx(output, contentType.title);

    setSnackbarConfig({
      severity: "success",
      message: "Downloaded!",
    });
    setOpenSnackar(true);
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

  const PageButtons = (
    <>
      <div className="clear-icon-container">
        <IconButton onClick={() => setOpenPreview(false)} sx={{zIndex: 3, color: 'white', backgroundColor: theme.palette.grey[500]}}>
          <Clear/>
        </IconButton>
      </div>
      <ZoomButtons fontsize={fontsize} setFontsize={setFontsize}/>
      {output !== contentType.defaultText && 
        <ContentActionButtons
          pageContentRef={pageContentRef}
          output={output}
          handleCopy={handleCopy}
          handlePDFDownload={handlePDFDownload}
          handleDocxDownload={handleDocxDownload}
        />
      }
    </>
  )

  // TODO: fix this so that it loads the laoding page properly
  // TODO: currently, it needs to check if its logged in before retrieving user data. will need to have a work around for
  // when the user is logged out
  if (loggedIn) {
    if (isLoadingUser) {
      return (
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="primary" />
        </Backdrop>
      </div>
      )
    }
  }

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
          
            <ResumeSelect resumeData={resumeData} setResumeData={setResumeData} setSnackbarConfig={setSnackbarConfig} setOpenSnackar={setOpenSnackar} uploading={uploading} setUploading={setUploading}/>

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
            <ContentInputSwitch contentType={contentType} input={input} setInput={setInput} recipientName={recipientName} setRecipientName={setRecipientName} question={question} setQuestion={setQuestion}/>
          </div>
          <div className='buttons-container'>
            <Button variant="contained" onClick={handleGenerate}>
              {loading || uploading ? 'Loading...' : 'Generate'}
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
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
            open={loading}
            component="RightSide"
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {window.innerWidth <= 1000 && PageButtons}
          <div className="page">
            {
              loggedIn ? 
                <TextField
                  className="page-content"
                  inputRef={pageContentRef}
                  multiline
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  sx = {{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                  InputProps={{
                    inputProps: {
                      style: { fontSize: `${fontsize}px` },
                    },
                  }}
                />
              :
                <div className="page-content" ref={pageContentRef} style={{
                  fontSize: `${fontsize}px`,
                }}>
                  {output.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)}
                </div>
            }
            {window.innerWidth > 1000 && PageButtons}
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
        {
          loggedIn ? 
          <AlertDialog 
            title={`Hey there ${userData.firstname}!`}
            content={
              <div>
                Our generated content is now <b>100% undetectable</b> by common AI detectors, so you can apply to jobs with confidence!
              </div>}
            onConfirm={null}/>
          :
          <div>{showLogin ? <LoginDialog onClose={handleToggleDialog} /> : <RegisterDialog onClose={handleToggleDialog} />}</div>
        }
      </div>
    </>
  );
}
