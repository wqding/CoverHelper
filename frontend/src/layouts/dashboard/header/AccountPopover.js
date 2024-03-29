import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { ListItemIcon } from '@mui/material';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Logout } from '@mui/icons-material';
import { Description } from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';


// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { currentUser, currentUserData, logout, setPromptSignUp } = useAuth();
  const [email, setEmail] = useState(currentUser.email)

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    logout().then(() => {
      // Sign-out successful.
    }).catch(() => {
      // TODO: add somem error handling
    });
  }

  const handlePricing = () => {
    setOpen(null);
    navigate('/pricing')
  }

  const handleHome = () => {
    setOpen(null);
    navigate('/app')
  }

  const handleSignUp = () => {
    setOpen(null);
    setPromptSignUp(true)
    navigate('/app')
  }

  if (!currentUserData) {
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

      { currentUser && !currentUser.isAnonymous ?
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
              {`${currentUserData.firstname} ${currentUserData.lastname}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {email}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />
          {
          /*
          <MenuItem sx={{ m: 0.25 }} onClick={handlePricing} >
            <ListItemIcon >
              <AddCircleOutlineOutlined fontSize="medium" />
            </ListItemIcon>
            <Box>
              <Typography variant="subtitle2" noWrap>
                Add Tokens
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {currentUserData.tokens}
              </Typography>
            </Box>
          </MenuItem>
          */
          }

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem sx={{ m: 0.25 }} onClick={handleHome} >
            <ListItemIcon>
              <Description fontSize="small" />
            </ListItemIcon>
            Home
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleLogout} sx={{ m: 0.25, my: 1 }}>
            <ListItemIcon >
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Popover>
        :
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
          <MenuItem sx={{ m: 0.25 }} onClick={handleSignUp} >
            <ListItemIcon>
              <Description fontSize="small" />
            </ListItemIcon>
            Sign Up!
          </MenuItem>
        </Popover>
      }
    </>
  );
}
