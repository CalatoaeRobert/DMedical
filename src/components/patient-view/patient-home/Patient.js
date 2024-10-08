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

function Patient(props){
    const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();
    const [open, setOpen] = React.useState(true);

    const toggleDrawer = () => {
      setOpen(!open);
    };

    React.useEffect(() => {
       loadWeb3()
       loadFilesContract()
    }, [props.account])

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

    const loadFilesContract = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        // const networkId = await web3.eth.net.getId()
        // const networkData = Patients.networks[networkId]
        // const networkData1 = Files.networks[networkId]

        // console.log(props.account)
        // if(networkData) {
        //   // Assign contract
        //   const files = new web3.eth.Contract(Patients.abi, networkData.address)
        //   const files1 = new web3.eth.Contract(Files.abi, networkData1.address)
        //   files.methods.getFilesForUser("0x681536517EEd5a1622485bf61119F27F477A871f").call().then((res) => {
        //     // web3.utils.padLeft(res[0], 31);
        //     console.log(files1.methods)
        //     // files1.methods.setApprovalForAll("0xb3a1b582511B00A235063DAad0919b7FE6FE66a5", true).call()
        //     files1.methods.isApprovedForAll("0x681536517EEd5a1622485bf61119F27F477A871f", networkData.address).call().then((res) => {console.log(res)})
            
    
        //       // files1.methods.transferFile("0x52854d37B5084CB76600a726409d64CCc0A2196B", parseInt(res[0])).call().then((res1) => {

        //       // })
            
        //     // files1.methods.ownerOf(1).call().then((asd) => {console.log(asd)})
            
        //   })
        //   files1.methods.ownerOf(1).call().then((res) => {console.log(res)})
        //   await files.methods.transferFileDoctor(networkData1.address, "0x89c7Ac6fdd489C432a4ffDbE4a576083cD15B4FB", 1).send({ from: accounts[0] }).on('transactionHash', (hash) => {      
                  
        //   }).on('error', (e) =>{
        //     window.alert('Error')
        //     // this.setState({loading: false})
          
        //   })
        //   files1.methods.ownerOf(1).call().then((res) => {console.log(res)})
        // }
        // BcaPuor5/dz8mQ5yiIycC0iO9LEcHswApBHZSRISOEk=
        // let encryptionPublicKey = "BcaPuor5/dz8mQ5yiIycC0iO9LEcHswApBHZSRISOEk="
        // const encryptedMessage = ethUtil.bufferToHex(
        //   Buffer.from(
        //     JSON.stringify(
        //       sigUtil.encrypt({
        //         publicKey: encryptionPublicKey,
        //         data: 'hello world!',
        //         version: 'x25519-xsalsa20-poly1305',
        //       })
        //     ),
        //     'utf8'
        //   )
        // );
        // console.log(encryptedMessage)
        // ethereum
        // .request({
        //   method: 'eth_decrypt',
        //   params: [encryptedMessage, accounts[0]],
        // })
        // .then((decryptedMessage) =>
        //   console.log('The decrypted message is:', decryptedMessage)
        // )
        // .catch((error) => console.log(error.message));
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
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
            <MainListItems />
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
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
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