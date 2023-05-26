import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import { DialogContent, DialogTitle, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';

import useResponsive from '../hooks/useResponsive';
import Logo from '../images/logo.png'
import { LoginForm } from '../sections/auth/login';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const LoginDialog = ({startOpen=true}) => {
  const [open, setOpen] = useState(startOpen)
  const [register, setRegister] = useState(false)
  const mdUp = useResponsive('up', 'md');


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!register &&
      <Dialog 
        open={open} 
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Typography variant="h4" gutterBottom>
            Sign in to CoverHelper
          </Typography>            
          <Typography variant="body2">
            Don’t have an account? {''}
            <Link href="register" variant="subtitle2">Get started</Link>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {"Hey there! To apply to jobs using our generated content, which is now 100% undetectable by common AI detectors, you must sign in or create an account first."}
          </DialogContentText>
          <LoginForm />
        </DialogContent>
      </Dialog>
      }

    </>
  );
}
