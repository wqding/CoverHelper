import { useState } from 'react';
import ReactGA from "react-ga4";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArticleRounded from '@mui/icons-material/ArticleRounded';
import AttachFile from '@mui/icons-material/AttachFile';

import { update, ref } from 'firebase/database';
import { auth, database } from "../services/firebase"



import { pdfToText } from '../utils/pdf';


export const ResumeSelect = ({resumeData, setResumeData, setSnackbarConfig, setOpenSnackar, uploading, setUploading}) => {
    const [file, setFile] = useState(null);
    // const [uploading, setUploading] = useState(false);

    const parseAndUpdatePDF = (file) => {
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
                const data = {
                    name: file.name,
                    text,
                    timestamp: new Date().toLocaleString(),
                }
                setResumeData(data);
                updateFirebaseResume(data);
            });
        }
        fr.readAsDataURL(file)
    }

    const updateFirebaseResume = (data) => {
        const user = auth.currentUser;
        const uid = user.uid;
        const dbUser = ref(database, `users/${uid}`);
        
        update(dbUser, {resume: data});
        setUploading(false);
    }

    const handleUpdateResume = (e) => {
        ReactGA.event({
            category: 'User',
            action: 'Click Upload'
        })
        if (e.target.files) {
            setUploading(true);
            parseAndUpdatePDF(e.target.files[0]);
            setFile(e.target.files[0]);
        }
    };
    
    return (
            resumeData ?

                <Stack
                    direction={{ xs: 'column', sm: 'row'}}
                    justifyContent="center"
                    alignItems="center"
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                    <Box sx={{ display:'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <ArticleRounded fontSize='large'/>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pl: 1, pb: 1 }}>
                            <Typography variant="subtitle1" color="text.primary">
                                Resume: {resumeData.name}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Uploaded on {resumeData.timestamp}
                            </Typography>
                        </Box>
                    </Box>
                    <Button variant="contained" startIcon={<AttachFile/>} sx={{height: '3rem'}} component="label" disabled={uploading}>
                        {file==null ? "Upload Resume/CV":`${file.name}`}
                        <input hidden type="file" onChange={handleUpdateResume}/>
                    </Button>
                </Stack>
                :
                <Button variant="contained" startIcon={<AttachFile/>} sx={{minWidth: "35%", height: '3rem'}} component="label" disabled={uploading}>
                    {file==null ? "Upload Resume/CV":`${file.name}`}
                    <input hidden type="file" onChange={handleUpdateResume}/>
                </Button>
    )
}