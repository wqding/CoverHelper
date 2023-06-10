import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { usePreview } from '../../contexts/PreviewContext';
import Header from './header';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { openPreview } = usePreview();
  return (
    <StyledRoot>
      {!openPreview && <Header />}
      <Outlet />
    </StyledRoot>
  );
}
