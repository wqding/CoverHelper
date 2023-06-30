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
import { useAuth } from '../../../contexts/AuthContext';
// components
import Iconify from '../../../components/iconify';
import { AUTH_EMAIL_ALREADY_IN_USE, AUTH_INVALID_EMAIL, AUTH_MISSING_PASSWORD } from '../../../utils/errorcodes';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);  
  const [snackbarConfig, setSnackbarConfig] = useState({
    severity: "success",
    message: "",
  });

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidFirstName, setInvalidFirstName] = useState(false)
  const [invalidLastName, setInvalidLastName] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleClick = async (e) => {
    // register user
    e.preventDefault();

    if (firstName === "") {
      setInvalidFirstName(true)
      setSnackbarConfig({
        severity: "error",
        message: "Error: First Name is required",
      });
      setOpenSnackar(true);
      return;
    }
    setInvalidFirstName(false)
    
    if (lastName === "") {
      setInvalidLastName(true)
      setSnackbarConfig({
        severity: "error",
        message: "Error: Last Name is required",
      });
      setOpenSnackar(true);
      return;
    }
    setInvalidLastName(false)

    await register(email, password, firstName, lastName)
      .catch((error) => {
          const errorCode = error.code;
          let errorMessage = error.message;
          // console.log(errorCode);
          // console.log(errorMessage);
          switch (errorCode) {
            case AUTH_EMAIL_ALREADY_IN_USE.code:
              errorMessage = AUTH_EMAIL_ALREADY_IN_USE.message;
              setInvalidEmail(true);
              setInvalidPassword(false);
              setErrorMsg(AUTH_EMAIL_ALREADY_IN_USE.message);
              break;
            case AUTH_INVALID_EMAIL.code:
              errorMessage = AUTH_INVALID_EMAIL.message;
              setInvalidEmail(true);
              setInvalidPassword(false);
              setErrorMsg(AUTH_INVALID_EMAIL.message);
              break;
            case AUTH_MISSING_PASSWORD.code:
              errorMessage = AUTH_MISSING_PASSWORD.message;
              setInvalidEmail(false)
              setInvalidPassword(true)
              setErrorMsg(AUTH_MISSING_PASSWORD.message)
              break;
            default:
              // TODO: add appropriate error handling
              navigate('/404');
              break;
          }

          setSnackbarConfig({
            severity: "error",
            message: `Error: ${errorMessage}`,
          });
          setOpenSnackar(true);
          // ..
      });
  };

  return (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <TextField 
          error={invalidEmail} 
          helperText={invalidEmail && errorMsg} 
          name="email" 
          label="Email address" 
          onChange={(e) => setEmail(e.target.value)}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField 
            error={invalidFirstName} 
            helperText={invalidFirstName && "Missing first name"} 
            name="firstName" 
            label="First Name" 
            fullWidth='true' 
            required='true' 
            onChange={(e) => setFirstName(e.target.value)} 
          />
          <TextField 
            error={invalidLastName} 
            helperText={invalidLastName && "Missing last name"} 
            name="lastName" 
            label="Last Name" 
            fullWidth='true' 
            required='true' 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </Stack>

        <TextField
          error={invalidPassword} 
          helperText={invalidPassword && errorMsg} 
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
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
        Register
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