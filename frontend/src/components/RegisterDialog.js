import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/node/Link';

import { RegisterForm } from '../sections/auth/register';
import { useAuth } from '../contexts/AuthContext';
// ----------------------------------------------------------------------

export const RegisterDialog = ({startOpen = true, onClose}) => {
  const { promptSignUp } = useAuth();
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
          {
            !promptSignUp ?
            <div>
              <Typography variant="h4" gutterBottom>
                Welcome to CoverHelper
              </Typography>
              <DialogContentText id="alert-dialog-slide-description">
                {"Hey there! To apply to jobs using our generated content, which is now 100% undetectable by common AI detectors, you must create an account first."}
              </DialogContentText> 
            </div>
            :
            <div>
              <Typography variant="h4" gutterBottom>
                Sign up for CoverHelper to keep using it
              </Typography> 
              <DialogContentText id="alert-dialog-slide-description">
                You've run out of sample cover letters! Don't worry, you can keep using our generated content (which is now <b>100% undetectable</b> by AI detectors) by simply signing in or creating an account for <b>free!</b>
              </DialogContentText>
            </div>
          }
        </DialogTitle>
        <DialogContent 
          sx={{
            width: '75%',
            alignSelf: 'center'
          }}
        >
          <RegisterForm />
          <Typography variant="body2" sx={{paddingTop: "10px"}}>
            Already have an account?&nbsp;
            <Link 
              color="primary" 
              underline="hover" 
              style={{ cursor: 'pointer' }}
              onClick={onClose}>
              <b>Login</b>
            </Link>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}