import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const AlertDialog = ({title, content, startOpen=true, onConfirm=null}) => {
    const [open, setOpen] = useState(startOpen);
    const handleClose = () => {
        setOpen(false);   
        if (onConfirm) {
            onConfirm();
        }
    }

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>Get Started!</Button>
            </DialogActions>
        </Dialog>
    )
}