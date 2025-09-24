import NetworkSwitcher from './NetworkSwitcher';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <NetworkSwitcher />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 