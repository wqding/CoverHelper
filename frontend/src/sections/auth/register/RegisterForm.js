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
// firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { set, ref } from 'firebase/database';
import { auth, database } from "../../../services/firebase"
// components
import Iconify from '../../../components/iconify';
import { AUTH_EMAIL_ALREADY_IN_USE } from '../../../utils/errorcodes';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

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

  const handleClick = async (e) => {
    // register user
    e.preventDefault();

    if (firstName === "") {
      setSnackbarConfig({
        severity: "error",
        message: "Error: First Name is required",
      });
      setOpenSnackar(true);
      return;
    }
    
    if (lastName === "") {
      setSnackbarConfig({
        severity: "error",
        message: "Error: Last Name is required",
      });
      setOpenSnackar(true);
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user.uid;

          navigate('/app', { replace: true });

          set(ref(database, `users/${user}`), {
            firstname: firstName,
            lastname: lastName,
            tokens: 2000,
          });
      })
      .catch((error) => {
          const errorCode = error.code;
          let errorMessage = error.message;
          // console.log(errorCode);
          // console.log(errorMessage);
          switch (errorCode) {
            case AUTH_EMAIL_ALREADY_IN_USE.code:
              errorMessage = AUTH_EMAIL_ALREADY_IN_USE.message;
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
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)}/>
        <Stack direction="row" alignItems="center" spacing={1}>
        <TextField name="firstName" label="First Name" fullWidth='true' required='true' onChange={(e) => setFirstName(e.target.value)} />
        <TextField name="lastName" label="Last Name" fullWidth='true' required='true' onChange={(e) => setLastName(e.target.value)} />
        </Stack>

        <TextField
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