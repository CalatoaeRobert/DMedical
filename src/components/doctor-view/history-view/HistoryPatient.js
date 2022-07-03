import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MainListItems from '../SidebarItems';
import Button from '@mui/material/Button'
import Web3 from 'web3';
import Files from '../../../abis/Files.json'
import ControlledAccordions from './ControlledAccordions';
import { useState, useEffect, useCallback } from 'react';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme({
    palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#00897b',
          // dark: will be calculated from palette.primary.main,
          // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
          light: '#891e00',
          main: '#891e00',
          // dark: will be calculated from palette.secondary.main,
          contrastText: '#e0f2f1',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
      },
});

export default function HistoryPatient(props){
    const [open, setOpen] = useState(true);
    const [history, setHistory] = useState("");

    const toggleDrawer = () => {
      setOpen(!open);
    };

    useEffect(() => {
        loadWeb3()
        loadHistory()
      }, [])
    
    const loadWeb3 = async () =>
    {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    const loadHistory = async () =>
    {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const filesData = Files.networks[networkId]

        const accounts = await web3.eth.getAccounts()

        let search = window.location.search;
        const params = new URLSearchParams(search);
        const patientAddress = params.get('patient')

        if(filesData) {
            const filesContract = new web3.eth.Contract(Files.abi, filesData.address)

            const hashesHistory = await filesContract.methods.getFilesHistory(accounts[0]).call()
            let hash = ''
            for (let i = 0; i < hashesHistory.length; i++)
            {
            if (hashesHistory[i]['patient'] == patientAddress)
                hash = hashesHistory[i]['_hash']
                console.log(hash)
            }
            console.log(hash)
            const url = `https://ipfs.moralis.io:2053/ipfs/${hash}`;
            const response = await fetch(url);
            response.json().then((history) => {
            window.ethereum
            .request({
            method: 'eth_decrypt',
            params: [history, accounts[0]],
            })
            .then((decryptedMessage) =>{
                console.log('The decrypted message is:', decryptedMessage)
                setHistory(decryptedMessage)
            }
            )
            .catch((error) => console.log(error.message));
            })
        }
    }

    return(
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex', height: "100%" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Patient History
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems account={props.account}/>
            <Divider sx={{ my: 1 }} />
            {/* {secondaryListItems} */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 5, mb: 1 }}> 
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <ControlledAccordions history={history}/>
                    </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        </Box>
        </ThemeProvider>
    )
    
}