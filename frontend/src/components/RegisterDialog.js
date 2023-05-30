import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { RegisterForm } from '../sections/auth/register';
// ----------------------------------------------------------------------

export const RegisterDialog = ({startOpen = true, onClose}) => {

  return (
    <>
      <Dialog 
        open={startOpen} 
        keepMounted
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
            Already have an account?
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