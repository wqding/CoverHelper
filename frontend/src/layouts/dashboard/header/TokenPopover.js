import { useState, useEffect } from 'react';

import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue} from "firebase/database";

// @mui
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover } from '@mui/material';
import Typography from '@mui/material/Typography';
// ----------------------------------------------------------------------
import { auth, database } from '../../../services/firebase';


// ----------------------------------------------------------------------

export default function TokenPopover() {
  const [open, setOpen] = useState(null);


  const [userData, setUserData] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          // ...
          console.log("uid", uid)

          const dbuser = ref(database, `users/${uid}`);
          onValue(dbuser, (snapshot) => {
            const data = snapshot.val();
            console.log(data.firstname)
            setUserData(data)
          });
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
        }
      });
  }, [])

  if (!userData) {
    return <div>Loading</div>
  }

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
        <Typography variant="h4">
        {userData.tokens}
        </Typography> 
    </>
  );
}
