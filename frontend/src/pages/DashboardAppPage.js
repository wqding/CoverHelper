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
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { usePreview } from '../contexts/PreviewContext';

import { useInterval } from '../hooks/useInterval';
import { contentOptions, toneOptions } from '../utils/constants';
import { ZoomButtons } from '../components/ZoomButtons';
import { ContentActionButtons } from '../components/ContentActionButtons';
import { ContentInputSwitch } from '../components/ContentInputSwitch';
import { ResumeSelect } from '../components/ResumeSelect';
import { RegisterDialog } from '../components/RegisterDialog';
import { LoginDialog } from '../components/LoginDialog';

import './DashboardAppPage.css'

export default function DashboardAppPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const { currentUser, currentUserData, logInAnonymously, promptSignUp, setPromptSignUp, decreaseTokens } = useAuth();
  const {openPreview, setOpenPreview, canPreview, setCanPreview} = usePreview();
  const [ resumeIsLoaded, setResumeIsLoaded ] = useState(false);
  const [resumeData, setResumeData] = useState(null)
  const [showLogin, setShowLogin] = useState(true);
  const [jobId, setJobId] = useState(null);

  const [tryAnonymously, setTryAnonymously] = useState(false)

  ReactGA.send({ hitType: "pageview", page: "/app", title: "Main Page" });

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          if (currentUserData) {
            if (currentUserData.resume) {
              setResumeData(currentUserData.resume);
            }
          }
        } else {
          // reset page state when logged out
          setResumeData(null);
          setResumeIsLoaded(false);
          setShowLogin(true);
        }
      });
  }, [])

  useEffect(() => {
    function handleResize() {
      if (pageContentRef.current === null) {
        return;
      }
      const { offsetWidth } = pageContentRef.current;

      setFontsize(Math.max(Math.ceil(0.029 * offsetWidth), 9));
    }
    window.addEventListener('resize', handleResize)
  }, [pageContentRef])
  
  // poll for job completion, null = no polling
  useInterval(async () => {
    console.log("Polling generated content");
    await getGeneratedContent(jobId);
  }, loading ? 15000 : null)

  const handleToggleDialog = () => {
    setShowLogin(!showLogin);
  };

  const handleAnonymousLogin = async () => {
    logInAnonymously()
      .catch((err) =>{
        console.log(err)
      })
  }

  const onSuccess = (message) => {
    setSnackbarConfig({
      severity: "success",
      message,
    });
    setOpenSnackar(true);
  }

  const onError = (message) => {
    setSnackbarConfig({
      severity: "error",
      message,
    });
    setOpenSnackar(true);
  }

  const sendGenerateRequest = () => {
    const url = process.env.REACT_APP_ENV === "production" ? "/generate" : `${process.env.REACT_APP_BASE_URL}/generate`;
    axios.post(url, {
      resume: resumeData.text,
      input,
      tone: toneValue,
      contentType: contentType.enum,
      recipientName,
      question,
    }).then(res => {
      console.log("job id", res.data.id)
      setJobId(res.data.id);
    }).catch(err => {
      onError(err.message)
    })
  }

  const getGeneratedContent = (jobId) => {
    const url = process.env.REACT_APP_ENV === "production" ? `/generate/job/${jobId}` : `${process.env.REACT_APP_BASE_URL}/generate/job/${jobId}`;
    axios.get(url)
    .then(res => {
      if (res.data.state === "completed") {
        const message = Buffer.from(res.data.return, 'base64').toString('utf8');
        setOutput(message);
        setLoading(false);

        // consume tokens after completed job, only for anonymous accounts for now
        if (currentUser.isAnonymous) {
          decreaseTokens(200);
        }
      } else if (res.data.state === "failed") {
        onError(res.data.reason);
        setLoading(false);
        
        // consume tokens after completed job, only for anonymous accounts for now
        if (currentUser.isAnonymous) {
          decreaseTokens(200);
        }
      }
    }).catch(err => {
      onError(err.message)
    })
  }

  const handleGenerate = () => {
    if (resumeData == null) {
      onError("Invalid resume: Ensure your resume is uploaded")
      return
    }
    if (resumeData.text.length < 20) {
      onError(<>Invalid resume: The resume is an unreadable pdf or too short. Try using a <a href="https://tools.pdf24.org/en/ocr-pdf">PDF OCR tool to convert it to text first</a></>)
      return
    }
    if (input === "") {
      onError("Error: Job/Company Description cannot be empty")
      return
    }
    if (loading || uploading) {
      return
    }

    // check if the users is anonymous before sending the request
    if (currentUser.isAnonymous && currentUserData.tokens <= 0) {
      setPromptSignUp(true)
      // show the register page
      setShowLogin(false)
      return
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

  const changeContentType = (option) => {
    setContentType(option);
    setOutput(option.defaultText);
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
          onSuccess={onSuccess}
          applicantName={currentUserData ? `${currentUserData.firstname}_${currentUserData.lastname}` : ""}
        />
      }
    </>
  )
  if (!resumeIsLoaded) {
    if (currentUserData) {
      setResumeData(currentUserData.resume)
      setResumeIsLoaded(true);
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
          
            <ResumeSelect resumeData={resumeData} setResumeData={setResumeData} onError={onError} uploading={uploading} setUploading={setUploading}/>

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
              disabled={!canPreview}
              // endIcon={<ArrowForward />}
            >
              Preview
            </Button>
          </div>
        </div>
        <div className='rightSide' data-generated={openPreview}>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {window.innerWidth <= 1000 && PageButtons}
          <div className="page">
            {
              currentUser ? 
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
                  {output}
                  {/* {output.split(/[\r\n]+/).map(p => <p>{p.split(" ").map(w => <span>{w} </span>)}</p>)} */}
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
          autoHideDuration={4000}
        >
          <Alert severity={snackbarConfig.severity} onClose={() => setOpenSnackar(false)}>{snackbarConfig.message}</Alert>
        </Snackbar>
        {
          (currentUserData === null || promptSignUp) && 
            <div>
              {showLogin ?
                <LoginDialog onClose={handleToggleDialog} tryAnonymously={handleAnonymousLogin}/> 
                : 
                <RegisterDialog onClose={handleToggleDialog} />
              }
            </div>
        }
      </div>
    </>
  );
}
