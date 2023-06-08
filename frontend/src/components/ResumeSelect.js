import { useState } from 'react';
import ReactGA from "react-ga4";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Description from '@mui/icons-material/Description';
import AttachFile from '@mui/icons-material/AttachFile';
import Box from '@mui/material/Box';

import { update, ref } from 'firebase/database';
import { auth, database } from "../services/firebase"

import { pdfToText } from '../utils/pdf';
import { docxToText } from '../utils/docx';
import { fileType } from '../utils/constants';

export const ResumeSelect = ({resumeData, setResumeData, setSnackbarConfig, setOpenSnackar, uploading, setUploading}) => {
    const [file, setFile] = useState(null);

    const parseAndUpdatePDF = (file) => {
        const fr=new FileReader();
        fr.onload= () => {
            pdfToText(fr.result, () => {}, (text) => {
                const data = {
                    name: file.name,
                    text,
                    timestamp: new Date().toLocaleString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }
                setResumeData(data);
                updateFirebaseResume(data);
            });
        }
        fr.readAsDataURL(file)
    }


    const parseAndUpdateWord = (file) => {
        const fr=new FileReader();
        fr.onload= () => {
            docxToText(fr.result, (text) => {
                const data = {
                    name: file.name,
                    text,
                    timestamp: new Date().toLocaleString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }
                setResumeData(data);
                updateFirebaseResume(data);
            });
        }
        fr.readAsBinaryString(file)
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
            switch (e.target.files[0].type) {
                case fileType.PDF:
                    setFile(e.target.files[0]);
                    parseAndUpdatePDF(e.target.files[0]);
                    break;
                case fileType.DOCX:
                    setFile(e.target.files[0]);
                    parseAndUpdateWord(e.target.files[0]);
                    break;
                default:
                    // did not match any formats
                    setSnackbarConfig({
                        severity: "error",
                        message: "Error: resume must be a PDF or DOCX file",
                    });
                    setUploading(false);
                    setOpenSnackar(true);
            }
        }
    };
    
    return (
            resumeData ?
                <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                    <Grid item xs={2} md={1}>
                        <Description fontSize='large'/>
                    </Grid>
                    <Grid item xs={5} md={6}>
                        <Box sx={{display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                File:&nbsp;
                            </Typography>
                            <Typography variant="subtitle1" color="text.primary">
                                {resumeData.name}
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Uploaded:&nbsp;
                            </Typography>
                            <Typography variant="subtitle2" color="text.primary">
                                {`${resumeData.timestamp.split(',')[0]},`}&nbsp;
                            </Typography>
                            <Typography variant="subtitle2" color="text.primary">
                                {resumeData.timestamp.split(',')[1]}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5} md={4} sx={{alignItems: "center"}}>
                        <Button variant="contained" startIcon={<AttachFile/>} sx={{minWidth: "35%", minHeight: '3rem'}} component="label" disabled={uploading}>
                            {file==null ? "Update Resume":`${file.name}`}
                            <input hidden type="file" onChange={handleUpdateResume}/>
                        </Button>
                    </Grid>
                </Grid>
                :
                <Button variant="contained" startIcon={<AttachFile/>} sx={{minWidth: "35%", minHeight: '3rem'}} component="label" disabled={uploading}>
                    {"Upload Resume/CV"}
                    <input hidden type="file" onChange={handleUpdateResume}/>
                </Button>
    )
}