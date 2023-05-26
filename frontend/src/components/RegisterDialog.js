import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import { DialogContent, DialogTitle, DialogActions, Link, Container, Typography } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../images/logo.png'
import { RegisterForm } from '../sections/auth/register';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export const RegisterDialog = ({startOpen = true}) => {
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
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Let's Get Started!
          </Typography>
          <img src={Logo} alt="register"/>           
          <Typography variant="h4" gutterBottom>
            Welcome to CoverHelper
          </Typography>

          <Typography variant="body2" sx={{ mb: 5 }}>
            Already have an account? {''}
            <Link href="login" variant="subtitle2">Login</Link>
          </Typography>

        </DialogTitle>
        <DialogContent>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </>
  );
}