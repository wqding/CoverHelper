import { useState, useEffect } from 'react';
// @mui
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue} from "firebase/database";


import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { auth, database } from '../../../services/firebase';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: 'Home',
  // },
  // {
  //   label: 'Profile',
  // },
  // {
  //   label: 'Settings',
  // },
  {
    label: 'Add tokens',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [email, setEmail] = useState('')

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          const email = user.email;
          setEmail(email)

          // ...
          console.log("uid", uid)

          const dbuser = ref(database, `users/${uid}`);
          onValue(dbuser, (snapshot) => {
            const data = snapshot.val();
            console.log(data.firstname)
            setUserData(data)
          });
          setLoggedIn(true)
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
          setLoggedIn(false)
        }
      });
  }, [])


  const handleLogout = () => {               
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Signed out successfully")
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  }

  if (!userData) {
    return <div>Loading</div>
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src='/assets/images/avatars/avatar_2.jpg' alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 0.75,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {`${userData.firstname} ${userData.lastname}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            Tokens
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            100000
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 0.25 }}>
          Add tokens
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
