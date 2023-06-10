import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import FileCopy from '@mui/icons-material/FileCopy';
import MoreHoriz from '@mui/icons-material/MoreVert';
import { PDFDownloadLink } from '@react-pdf/renderer'
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';

import { generatePDF } from '../utils/pdf';
import { downloadDocx } from '../utils/docx';
import { IconMenu } from './IconMenu';

export const ContentActionButtons = ({ pageContentRef, output, onSuccess, applicantName }) => {
    const theme = useTheme();
    const [editing, setEditing] = useState(false);
    const [filename, setFilename] = useState(`${applicantName}_cover_letter`);

    useEffect(() => {
        if (output) {
            const pattern = /^Dear (.+) Hiring Team,/;
            const firstLine = output.split("\n")[0];
            const match = pattern.test(firstLine); 
            if (match) {
                const companyName = firstLine.match(pattern)[1]; // Extract the company name
                setFilename(`${applicantName}_${companyName}_cover_letter`);
            }
        }
    }, [output])

    const handleEdit = () => {
        pageContentRef.current.contentEditable = true;
        pageContentRef.current.suppressContentEditableWarning = true;
        pageContentRef.current.style.pointerEvents = 'auto';
        pageContentRef.current.style.userSelect = 'auto';
        pageContentRef.current.focus();
        setEditing(true);
    }

    const handleSave = () => {
        pageContentRef.current.contentEditable = false;
        pageContentRef.current.suppressContentEditableWarning = false;
        pageContentRef.current.style.pointerEvents = 'none';
        pageContentRef.current.style.userSelect = 'none';
        setEditing(false);
    }

    const handleDocxDownload = () => {
        downloadDocx(output, filename);
        onSuccess("Downloaded!")
    };

    const handlePDFDownload = () => {
        onSuccess("Downloaded!")
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        onSuccess("Copied!")
    };
    
    return (
        <>
            <div style={{
                zIndex: 3,
                position: 'absolute',
                top: 0,
                marginTop: '2rem',
                right: 0,
                marginRight: '2rem',
            }}>
                {editing ? 
                    <Button variant="contained" startIcon={<Save/>} onClick={handleSave} sx={{color: 'white', backgroundColor: theme.palette.success.dark, ":hover": {backgroundColor: theme.palette.success.main}}}>
                        Save
                    </Button>
                    :
                    <Button variant="contained" startIcon={<Edit/>} onClick={handleEdit} sx={{color: 'white', backgroundColor: theme.palette.primary.main, ":hover": {backgroundColor: theme.palette.primary.light}}}>
                        Edit
                    </Button>
                }
            </div>
            <div style={{
                zIndex: 3,
                position: 'absolute',
                bottom: 0,
                marginBottom: '2rem',
                right: 0,
                marginRight: '1rem',
            }}>
                <IconButton aria-label="copy" onClick={handleCopy} sx={{color: 'white', backgroundColor: theme.palette.primary.main, ":hover": {backgroundColor: theme.palette.primary.light}}}>
                    <FileCopy />
                </IconButton>
                <IconMenu
                    Icon={<MoreHoriz />} 
                    MenuItems={[
                        <PDFDownloadLink key="pdf-download" document={generatePDF(output)} fileName={`${filename}.pdf`} style={{color: theme.palette.text.primary, textDecoration: 'none'}}><MenuItem onClick={handlePDFDownload}>Download PDF</MenuItem></PDFDownloadLink>,
                        <MenuItem key="word-download" onClick={handleDocxDownload}>Download Word Document</MenuItem>
                    ]}
                    sx={{color: 'white', backgroundColor: theme.palette.primary.main, ":hover": {backgroundColor: theme.palette.primary.light}, marginLeft: '5px'}}
                />
            </div>
        </>
    )
}