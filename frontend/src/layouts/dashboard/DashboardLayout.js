import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';

import Header from './header';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

// ----------------------------------------------------------------------

export default function DashboardLayout() {

  const [open, setOpen] = useState(false);
  
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      <Outlet />
    </StyledRoot>
  );
}
