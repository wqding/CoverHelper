import { useState, useRef, useEffect } from 'react'


import { onAuthStateChanged, signOut } from "firebase/auth";
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';

// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import AccountPopover from './AccountPopover';
import TokenPopover from './TokenPopover'

import { auth, database } from '../../../services/firebase';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ opacity: -1, blur: -1}),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          // ...
          console.log("uid", uid)
          setLoggedIn(true)
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
          setLoggedIn(false)
        }
      });
  }, [])

  return (
    <StyledRoot>
      <StyledToolbar>
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {
          loggedIn &&
          <>
            <TokenPopover/>
            <AccountPopover />
          </>
          }
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
