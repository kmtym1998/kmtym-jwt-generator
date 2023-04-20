import { AppBar, Toolbar } from '@mui/material';

const AppHeader = (): JSX.Element => {
  return (
    <AppBar>
      <Toolbar className={'h-toolbar'}>JWT Generator</Toolbar>
    </AppBar>
  );
};

export default AppHeader;
