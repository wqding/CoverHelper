import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import { DialogContent, DialogTitle, DialogActions, Link, Container, Typography, Button } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../images/logo.png'
import { RegisterForm } from '../sections/auth/register';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export const RegisterDialog = ({startOpen = true, onClose}) => {
  const mdUp = useResponsive('up', 'md');
  const [open, setOpen] = useState(startOpen)

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Typography variant="h3">
            Let's Get Started!
          </Typography>        
          <Typography variant="h4" gutterBottom>
            Welcome to CoverHelper
          </Typography>
          <DialogContentText id="alert-dialog-slide-description">
            {"Hey there! To apply to jobs using our generated content, which is now 100% undetectable by common AI detectors, you must create an account first."}
          </DialogContentText>      
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" >
            Already have an account? {''}
            <Button color="primary" onClick={onClose}>
              Login
            </Button>
          </Typography>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </>
  );
}