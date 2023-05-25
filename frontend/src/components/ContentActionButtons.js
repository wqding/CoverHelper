import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import FileCopy from '@mui/icons-material/FileCopy';
import MoreHoriz from '@mui/icons-material/MoreVert';
import { PDFDownloadLink } from '@react-pdf/renderer'

import { generatePDF } from '../utils/pdf';
import { IconMenu } from './IconMenu';

export const ContentActionButtons = ({ output, handleCopy, handlePDFDownload, handleDocxDownload }) => {
    const theme = useTheme();
    return (
        <div style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            marginRight: '1rem',
            marginBottom: '2rem',
        }}>
            <IconButton aria-label="copy" onClick={handleCopy} sx={{color: 'white', backgroundColor: theme.palette.primary.main, ":hover": {backgroundColor: theme.palette.primary.light}}}>
                <FileCopy />
            </IconButton>
            <IconMenu
            Icon={<MoreHoriz />} 
            MenuItems={[
                <PDFDownloadLink document={generatePDF(output)} fileName="CoverLetter.pdf" style={{color: theme.palette.text.primary, textDecoration: 'none'}}><MenuItem onClick={handlePDFDownload}>Download PDF</MenuItem></PDFDownloadLink>,
                <MenuItem onClick={handleDocxDownload}>Download Word Document</MenuItem>
            ]}
            sx={{color: 'white', backgroundColor: theme.palette.primary.main, ":hover": {backgroundColor: theme.palette.primary.light}, marginLeft: '5px'}}
            />
        </div>
    )
        }