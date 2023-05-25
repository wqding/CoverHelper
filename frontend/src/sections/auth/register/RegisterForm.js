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
import { auth } from "../../../services/firebase"
// components
import Iconify from '../../../components/iconify';

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

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          navigate('/dashboard', { replace: true });
          // ...
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          if (errorCode === 'auth/email-already-in-use') {
            setSnackbarConfig({
              severity: "error",
              message: "Error: User with this email already exists",
            });
            setOpenSnackar(true);
          } else {
            // TODO: add appropriate error handling
            navigate('/404')
          }
          // ..
      });
  };

  return (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)}/>
        <Stack direction="row" alignItems="center" spacing={1}>
        <TextField name="firstName" label="First Name" fullWidth='true' />
        <TextField name="lastName" label="Last Name" fullWidth='true' />
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