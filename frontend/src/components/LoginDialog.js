import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/node/Link';

import { LoginForm } from '../sections/auth/login';
import { useAuth } from '../contexts/AuthContext';

// ----------------------------------------------------------------------

export const LoginDialog = ({startOpen=true, onClose, tryAnonymously}) => {
  const { currentUser } = useAuth();
  return (
    <>
        <Dialog 
          open={startOpen} 
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle> 
            {
              currentUser && currentUser.isAnonymous ?
              <div>
                <Typography variant='h4' gutterBottom>
                  Sign in to CoverHelper to keep using it
                </Typography>
                <DialogContentText id='alert-dialog-slide-description'>
                  You've run out of sample cover letters! Don't worry, you can keep using our generated content (which is now <b>100% undetectable</b> by AI detectors) by simply signing in or creating an account for <b>free</b>!
                </DialogContentText>
              </div>
              :
              <div>
                <Typography variant="h4" gutterBottom>
                  Sign in to CoverHelper
                </Typography> 
                <DialogContentText id="alert-dialog-slide-description">
                  Exciting news! Our generated content is now <b>100% undetectable</b> by AI detectors. To begin, simply sign in or create an account.
                  {
                    // only show this to first time users (users that are not authenticated)
                    !currentUser &&
                    <div>
                      Alternatively, you can also&nbsp;
                      <Link 
                        color="primary" 
                        underline="hover" 
                        style={{ cursor: 'pointer' }}
                        onClick={tryAnonymously}>
                        <b>try it out</b>
                      </Link>&nbsp;before signing up!
                    </div>
                  }
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
            <LoginForm />
            <Typography variant="body2" sx={{paddingTop: "10px"}}>
              Don’t have an account?&nbsp;
              <Link 
                color="primary" 
                underline="hover" 
                style={{ cursor: 'pointer' }}
                onClick={onClose}>
                <b>Get started</b>
              </Link>
            </Typography>
          </DialogContent>
        </Dialog>
    </>
  );
}
