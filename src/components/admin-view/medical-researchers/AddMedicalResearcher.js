import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Web3 from 'web3';
import MedicalReseachers from '../../../abis/MedicalResearchers.json';
import Registration from '../../../abis/Registration.json';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from "material-ui-search-bar";
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';



export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };
  
  const addMedicalReseacher = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const registrationData = Registration.networks[networkId]
    const researcherData = MedicalReseachers.networks[networkId]
    if(researcherData) {
        const reseacherContract = new web3.eth.Contract(MedicalReseachers.abi, researcherData.address)
        const accounts = await web3.eth.getAccounts()

        await reseacherContract.methods.addResearcher({
            name: name, city:city, country:country, nrOfPatients:0,
            _address:walletAddress}
        ).send({ from: accounts[0] }).on('transactionHash', (hash) => {
          window.location.reload()
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
           
          })
    }
    setOpen(false);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");

  const handleNameChange = (newValue) => {
    setName(newValue.target.value);
  };

  const handleCountryChange = (newValue) => {
    setCountry(newValue.target.value);
  };

  const handleCityChange = (newValue) => {
    setCity(newValue.target.value);
  };

  const handleWalletAddressChange = (newValue) => {
    setWalletAddress(newValue.target.value);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{textTransform: 'none', mt: 1.5, ml: props.open ? 3:9}}>
        ADD MEDICAL RESEACHER
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a reseacher</DialogTitle>
        <DialogContent>
          <Box
              component="form"
              sx={{
                '& > :not(style)': { mt: 1, width: '45ch' },
              }}
              noValidate
              autoComplete="off"
            >
            <TextField id="outlined-basic" label="Name" variant="outlined" id="name" value={name}
            onChange={handleNameChange}/>
            <TextField id="outlined-basic" label="Country" variant="outlined" id="country" value={country}
            onChange={handleCountryChange}/>
            <TextField id="outlined-basic" label="City" variant="outlined" id="city" value={city}
            onChange={handleCityChange}/>
            <TextField id="outlined-basic" label="Wallet Address" variant="outlined" id="walletAddress" value={walletAddress}
            onChange={handleWalletAddressChange}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={addMedicalReseacher}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
