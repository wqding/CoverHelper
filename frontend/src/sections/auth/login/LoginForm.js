import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { AUTH_INVALID_EMAIL, AUTH_MISSING_PASSWORD, AUTH_USER_NOT_FOUND, AUTH_WRONG_PASSWORD } from '../../../utils/errorcodes';
import { useAuth } from '../../../contexts/AuthContext';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);  
  const [snackbarConfig, setSnackbarConfig] = useState({
    severity: "success",
    message: "",
  });

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleClick = async () => {
    login(email, password)
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage)

        // TODO: Refactor this to have an error message function
        switch (errorCode) {
          case AUTH_USER_NOT_FOUND.code:
            errorMessage = AUTH_USER_NOT_FOUND.message;
            break;
          case AUTH_INVALID_EMAIL.code:
            errorMessage = AUTH_INVALID_EMAIL.message;
            break;
          case AUTH_MISSING_PASSWORD.code:
            errorMessage = AUTH_MISSING_PASSWORD.message;
            break;
          case AUTH_WRONG_PASSWORD.code:
            errorMessage = AUTH_WRONG_PASSWORD.message;
            break;
          default:
            // TODO: add appropriate error handling
            navigate('/404')
            break;
        }

        setSnackbarConfig({
          severity: "error",
          message: `Error: ${errorMessage}`,
        });
        setOpenSnackar(true);
      });
  }

  return (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)}/>

        <TextField
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
        anchorOrigin={{ vertical:'top', horizontal:"right" }}
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
