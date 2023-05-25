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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../../services/firebase"
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackar] = useState(false);  
  const [snackbarConfig, setSnackbarConfig] = useState({
    severity: "success",
    message: "",
  });

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleClick = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user)
          navigate('/dashboard', { replace: true });
      })
      .catch((error) => {

          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
          if ((errorCode === 'auth/invalid-email') || (errorCode === 'auth/missing-password') || (errorCode === 'auth/wrong-password')) {
            setSnackbarConfig({
              severity: "error",
              message: "Error: Either email or password is incorrect",
            });
            setOpenSnackar(true);
          } else {
            // TODO: add appropriate error handling
            navigate('/404')
          }
      });
   
  };

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
