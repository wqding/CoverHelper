import { useTheme } from '@mui/material/styles';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

export const ZoomButtons = ({fontsize, setFontsize}) => {
    const theme = useTheme();

    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            margin: '2rem',
            zIndex: 3,
        }}>
            <Tooltip title="Zoom In" placement="top" arrow>
            <IconButton aria-label="increase font size" variant="contained" onClick={() => setFontsize(fontsize+1)} sx={{color: 'white', backgroundColor: theme.palette.background.contrast, ":hover": {backgroundColor: theme.palette.action.focus}}}>
                <Add />
            </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out" placement="top" arrow>
            <IconButton aria-label="decrease font size" variant="contained" onClick={() => setFontsize(fontsize-1)} sx={{color: 'white', backgroundColor: theme.palette.background.contrast, ":hover": {backgroundColor: theme.palette.action.focus}, marginLeft: '5px'}}>
                <Remove />
            </IconButton>
            </Tooltip>
        </div>
    )
}