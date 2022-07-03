import * as React from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { padding } from '@mui/system';
import { useNavigate } from "react-router-dom";
import Navbar from '../navbar/Navbar';
import DoctorCard from '../DoctorCard';
import Files from '../../../abis/Files.json';
import Patients from '../../../abis/Patients.json';
import MedicalResearchers from '../../../abis/MedicalResearchers.json';
import Web3 from 'web3';
import DoctorsCards from './DoctorsCards';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MainListItems from '../SidebarItems';
import Button from '@mui/material/Button'
import { useMoralis } from "react-moralis";
const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');
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
          main: '#00897b',
        },
        secondary: {
          light: '#891e00',
          main: '#891e00',
          contrastText: '#e0f2f1',
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
      },
});

function Patient(props){
    const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();
    const [open, setOpen] = React.useState(true);

    const toggleDrawer = () => {
      setOpen(!open);
    };

    React.useEffect(() => {
       loadWeb3()
       //loadResearchersRequests()
    }, [])

    const loadWeb3 = async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    const loadResearchersRequests = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const networkData = MedicalResearchers.networks[networkId]
        const patientData = Patients.networks[networkId]
        if(networkData) {
          const accounts = await web3.eth.getAccounts()
          const researcherContract = new web3.eth.Contract(MedicalResearchers.abi, networkData.address)
          const patientContract = new web3.eth.Contract(Patients.abi, patientData.address)

          const requests = await researcherContract.methods.getRequestsOfAResearcher(accounts[0]).call()
          for (let i = 0; i < requests.length; i++){
            if (requests[i]['researcher'] != '0x0000000000000000000000000000000000000000'){
              const encryptionKey = await researcherContract.methods.getEncryptionPublicKey(requests[i]['researcher']).call()

              const patient = await patientContract.methods.getPatient(accounts[0]).call()
        
              const url = `https://ipfs.moralis.io:2053/ipfs/${patient['_hash']}`;
              const response = await fetch(url);
              response.json().then((historyEncrypted) => {
                
                window.ethereum
                .request({
                  method: 'eth_decrypt',
                  params: [historyEncrypted, accounts[0]],
                })
                .then((decryptedHistory) =>{
                  console.log(decryptedHistory)
                  const encryptedMessage = ethUtil.bufferToHex(
                    Buffer.from(
                      JSON.stringify(
                        sigUtil.encrypt({
                          publicKey: encryptionKey,
                          data: JSON.stringify(decryptedHistory),
                          version: 'x25519-xsalsa20-poly1305',
                        })
                      ),
                      'utf8'
                    )
                  );
                  const file = new Moralis.File("history.json", {
                    base64: btoa(unescape(encodeURIComponent(JSON.stringify(encryptedMessage)))),
                  });
                  file.saveIPFS().then(() => {
                    console.log(requests[i]['researcher'])
                    researcherContract.methods.acceptRequestFromResearcher(requests[i]['researcher'], requests[i]['index'], file.hash()).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                    }).on('error', (e) =>{
                      window.alert('Error')
                      // this.setState({loading: false})
                    
                    }).then(() => {researcherContract.methods.addFilesToResearcher(requests[i]['researcher'], file.hash()).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                    }).on('error', (e) =>{
                      window.alert('Error')
                      // this.setState({loading: false})
                    
                    }).then(() => {})})
                    
                  });
                }
                )
                .catch((error) => console.log(error.message));
        
              })
            }
            }
        }
      }

    return (
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
              Doctors
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
          <Container maxWidth="lg" sx={{ mt: 2, mb: 1 }}> 
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ paddingTop: 2, paddingBottom: 2, display: 'flex', flexDirection: 'column' }}>
                        <DoctorsCards />
                    </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        </Box>
        </ThemeProvider>
    )
}

export default Patient