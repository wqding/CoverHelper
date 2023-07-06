import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import Button from '@mui/material/node/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import GoogleIcon from '@mui/icons-material/Google';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { AUTH_INVALID_EMAIL, AUTH_MISSING_PASSWORD, AUTH_TOO_MANY_REQUESTS, AUTH_USER_NOT_FOUND, AUTH_WRONG_PASSWORD } from '../../../utils/errorcodes';
import { useAuth } from '../../../contexts/AuthContext';
import { Divider } from '@mui/material/node';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const { login, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);  
  const [snackbarConfig, setSnackbarConfig] = useState({
    severity: "success",
    message: "",
  });
  const [errorMsg, setErrorMsg] = useState("")

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);


  const handleClick = async () => {
    login(email, password)
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        // console.log(errorCode)
        // console.log(errorMessage)

        errorMessage = handleErrors(errorCode, errorMessage)

        setSnackbarConfig({
          severity: "error",
          message: `Error: ${errorMessage}`,
        });
        setOpenSnackar(true);
      });
  }

  const handleGoogleLogin = async () => {
    loginWithGoogle()
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        // console.log(errorCode)
        // console.log(errorMessage)

        errorMessage = handleErrors(errorCode, errorMessage)

        setSnackbarConfig({
          severity: "error",
          message: `Error: ${errorMessage}`,
        });
        setOpenSnackar(true);
      });
  }

  const handleErrors = (errorCode, errorMessage) => {
    switch (errorCode) {
      case AUTH_USER_NOT_FOUND.code:
        errorMessage = AUTH_USER_NOT_FOUND.message;
        setInvalidEmail(true)
        setInvalidPassword(false)
        setErrorMsg(AUTH_USER_NOT_FOUND.message)
        break;
      case AUTH_INVALID_EMAIL.code:
        errorMessage = AUTH_INVALID_EMAIL.message;
        setInvalidEmail(true)
        setInvalidPassword(false)
        setErrorMsg(AUTH_INVALID_EMAIL.message)
        break;
      case AUTH_MISSING_PASSWORD.code:
        errorMessage = AUTH_MISSING_PASSWORD.message;
        setInvalidEmail(false)
        setInvalidPassword(true)
        setErrorMsg(AUTH_MISSING_PASSWORD.message)
        break;
      case AUTH_WRONG_PASSWORD.code:
        errorMessage = AUTH_WRONG_PASSWORD.message;
        setInvalidEmail(false)
        setInvalidPassword(true)
        setErrorMsg(AUTH_WRONG_PASSWORD.message)
        break;
      case AUTH_TOO_MANY_REQUESTS.code:
        errorMessage = AUTH_TOO_MANY_REQUESTS.message;
        setInvalidEmail(false)
        setInvalidPassword(true)
        setErrorMsg(AUTH_TOO_MANY_REQUESTS.message)
        break;
      default:
        // TODO: add appropriate error handling
        errorMessage = ''
        navigate('/404')
        break;
    }
    return errorMessage

  }

  return (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>

        <LoadingButton sx={{width: '100%'}} fullWidth size="large" type="submit" variant="contained" onClick={handleGoogleLogin}>
          <GoogleIcon fontSize="small"/> Sign in with Google
        </LoadingButton>

        <Divider>Or</Divider>

        <TextField 
          error={invalidEmail}
          helperText={invalidEmail && errorMsg}
          name="email" 
          label="Email address" 
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          error={invalidPassword}
          helperText={invalidPassword && errorMsg}
          name="password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:"center" }}
        open={openSnackbar}
        onClose={() => setOpenSnackar(false)}
        message={snackbarConfig.message}
        autoHideDuration={2000}
      >
        <Alert severity={snackbarConfig.severity} onClose={() => setOpenSnackar(false)}>{snackbarConfig.message}</Alert>
      </Snackbar>
    </>
  );
}
