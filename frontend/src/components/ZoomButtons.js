
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';

export const ZoomButtons = ({fontsize, setFontsize, ...other}) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            margin: '1rem',
        }}>
            <Tooltip title="Zoom In" placement="top" arrow>
            <IconButton aria-label="increase font size" variant="contained" onClick={() => setFontsize(fontsize+1)} {...other}>
                <Add />
            </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out" placement="top" arrow>
            <IconButton aria-label="decrease font size" variant="contained" onClick={() => setFontsize(fontsize-1)} {...other}>
                <Remove />
            </IconButton>
            </Tooltip>
        </div>
    )
}