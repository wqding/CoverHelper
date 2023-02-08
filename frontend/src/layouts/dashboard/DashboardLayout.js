import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  return (
    <StyledRoot>
      <Outlet />
    </StyledRoot>
  );
}
