import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

export const LoginDialog = ({startOpen=true, onClose}) => {
  return (
    <>
        <Dialog 
          open={startOpen} 
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle> 
            <Typography variant="h4" gutterBottom>
              Sign in to CoverHelper
            </Typography> 
            <DialogContentText id="alert-dialog-slide-description">
              Exciting news! Our generated content is now <b>100% undetectable</b> by AI detectors. To begin, simply sign in or create an account.
            </DialogContentText>
          </DialogTitle>
          <DialogContent 
            sx={{
              width: '75%',
              alignSelf: 'center'
            }}
          >
            <LoginForm />
            <Typography variant="body2" >
              Don’t have an account?
              <Button color="primary" onClick={onClose}>
                Get started
              </Button>
            </Typography>
          </DialogContent>
        </Dialog>
    </>
  );
}
