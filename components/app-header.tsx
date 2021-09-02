import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';

export default function AppHeader(): JSX.Element {
  return (
    <AppBar>
      <Toolbar className={'h-toolbar'}>JWT Generator</Toolbar>
    </AppBar>
  );
}
