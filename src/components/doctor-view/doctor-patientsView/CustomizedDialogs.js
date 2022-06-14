import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Web3 from 'web3';
import Patients from '../../../abis/Patients.json';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from "material-ui-search-bar";

const shell = require('shelljs')
const path = require('path')
const synthea_path = 'C:/Licenta/ehr/synthea'
const synthea_international_path = 'C://Licenta//ehr//synthea-international'

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const exec = require('child_process').exec;
  const addPatient = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Patients.networks[networkId]
    if(networkData) {
        const patientC = new web3.eth.Contract(Patients.abi, networkData.address)
        const accounts = await web3.eth.getAccounts()
        await patientC.methods.registerAPatientAsDoctor(
          fname, lname, gender, addressLocation,
        city, country, cnp, address, birthDateConverted
        ).send({ from: accounts[0] }).on('transactionHash', (hash) => {
           window.location.reload()
           
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
           
          })
    }
    setOpen(false);
  };

  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [birthDate, setBirthDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const [birthDateConverted, setBirthDateConverted] = React.useState(0)
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [gender, setGender] = React.useState("Male");
  const [addressLocation, setAddressLocation] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [cnp, setCNP] = React.useState("");
  

  const handleBirthDateChange = (newValue) => {
    let date = (new Date(newValue)).getTime() / 1000;
    setBirthDate(newValue);
    setBirthDateConverted(date)
  };

  const handleLastNameChange = (newValue) => {
    setLname(newValue.target.value);
  };

  const handleFirstNameChange = (newValue) => {
    setFname(newValue.target.value);
  };

  const handleCountryChange = (newValue) => {
    setCountry(newValue.target.value);
  };

  const handleCityChange = (newValue) => {
    setCity(newValue.target.value);
  };

  const handleGenderChange = (newValue) => {
    setGender(newValue.target.value);
  };

  const handleAddressLocationChange = (newValue) => {
    setAddressLocation(newValue.target.value);
  };

  const handleAddressChange = (newValue) => {
    setAddress(newValue.target.value);
  };

  const handleCNPChange = (newValue) => {
    setCNP(newValue.target.value);
  };

  const genders = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    }
  ];

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{textTransform: 'none', mt: 1.5, ml: props.open ? 3:9}}>
        Add Patient
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a patient</DialogTitle>
        <DialogContent>
          <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '45ch' },
              }}
              noValidate
              autoComplete="off"
            >
            <TextField id="outlined-basic" label="First Name" variant="outlined" id="fname" value={fname}
            onChange={handleFirstNameChange}/>
            <TextField id="outlined-basic" label="Last Name" variant="outlined" id="lname" value={lname}
            onChange={handleLastNameChange}/>
            <TextField id="outlined-basic" label="Country" variant="outlined" id="country" value={country}
            onChange={handleCountryChange}/>
            <TextField id="outlined-basic" label="City" variant="outlined" id="city" value={city}
            onChange={handleCityChange}/>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="BirthDate"
                inputFormat="MM/dd/yyyy"
                value={birthDate}
                onChange={handleBirthDateChange}
                renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <TextField id="outlined-basic" select label="Gender" variant="outlined" id="gender" value={gender}
            onChange={handleGenderChange}>
              {genders.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
            <TextField id="outlined-basic" label="Address Location" variant="outlined" id="addressLocation" value={addressLocation}
            onChange={handleAddressLocationChange}/>
            <TextField id="outlined-basic" label="Address" variant="outlined" id="address" value={address}
            onChange={handleAddressChange}/>
            <TextField id="outlined-basic" label="CNP" variant="outlined" id="cnp" value={cnp}
            onChange={handleCNPChange}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={addPatient}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
