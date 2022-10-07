
import './Register.css';
import { useState, useEffect, useCallback } from 'react';
import PatientForm from "./PatientForm/PatientForm";
import ResearcherForm from "./ResearcherForm/ResearcherForm";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { height } from '@mui/system';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Web3 from 'web3';
import Patients from '../../abis/Patients.json';
import Files from '../../abis/Files.json'
import Registration from '../../abis/Registration.json';

import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getTime } from 'date-fns';

import { useMoralis } from "react-moralis";
import { useNavigate } from "react-router-dom";
import { useNotification } from 'web3uikit';

const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');

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

      const CssTextField = withStyles({
        root: {
          '& label.Mui-focused': {
            color: '#099057',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#099057',
          },
          '& .MuiOutlinedInput-root': {   
            '&:hover fieldset': {
              borderColor: '#099057',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#099057',
            },
          },
        },
      })(TextField);

function Register(props){
    const navigate = useNavigate();
    
    const [checked, setChecked] = useState("");
    const theme = createTheme();

    const [fname, setFname] = React.useState("");
    const [lname, setLname] = React.useState("");
    const [birthDate, setBirthDate] = React.useState(new Date('2014-08-18T21:11:54'));
    const [birthDateConverted, setBirthDateConverted] = React.useState(0);
    const [country, setCountry] = React.useState("");
    const [city, setCity] = React.useState("");
    const [gender, setGender] = React.useState("Male");
    const [addressLocation, setAddressLocation] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [cnp, setCNP] = React.useState("");

    const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();

    // const dispatch = useNotification();

    // Moralis.onAccountChanged( async (account) => {
    //     dispatch({
    //     type: "info",
    //     message: "You changed accounts",
    //     title: "Account changed",
    //     position: "topL"
    //     })
    //     console.log("changed")
    //     logout();
    //     navigate('/login')
    // });

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

  const https = require('https'); // or 'https' for https:// URLs
  const fs = require('fs');
  const axios = require('axios')

  const getFile = async () => {
    


    // listAll(listRef)
    // .then((res) => {
    //   res.prefixes.forEach((folderRef) => {
    //     listAll(folderRef).then((subF) => {
    //       subF.items.forEach((itemRef) => {
    //         const path = itemRef.fullPath
    //         if (path.includes(ageRange)){
    //           first++;
    //           if (first == 1){
    //             const pathReference = ref(storage, itemRef.fullPath)
    //             getDownloadURL(pathReference).then((url) => {
    //               axios.get(url).then((response) => {
    //                 return response['data']
    //             })
    //           })
    //           }
    //         }
    //       })   
    //     })
    //   });
    //   res.items.forEach((itemRef) => {
    //     // All the items under listRef.
    //   });
    // }).catch((error) => {
    //   // Uh-oh, an error occurred!
    // });
  }

  const getMonths = () => {
    var today = new Date()
    var months;
    months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
  }

  const getAge = () => {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  const getAgeRange = () => {
    const age = getAge();

    if (age >= 18 && age <= 23)
      return '18-23';
    if (age >= 24 && age <= 29)
      return '24-29';
    if (age >= 30 && age <= 35)
      return '30-35';
    if (age >= 36 && age <= 41)
      return '36-41';
    if (age >= 42 && age <= 47)
      return '42-47';
    if (age >= 48 && age <= 53)
      return '48-53';
    if (age >= 54 && age <= 59)
      return '54-59';
    if (age >= 60 && age <= 65)
      return '60-65';
    if (age >= 66 && age <= 71)
      return '66-71';
    if (age >= 72 && age <= 77)
      return '72-77';
    if (age >= 78 && age <= 83)
      return '78-83';
    if (age >= 84 && age <= 89)
      return '84-89';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let storage = getStorage()
    const listRef = ref(storage, country + '/' + city + '/' + gender.toLowerCase() + '/');
    
    let ageRange = getAgeRange();
    let first = 0;
    
    const res = await listAll(listRef);
    if (res.prefixes.length == 0){
      window.alert('No suitable medical history was found')
    }
    else{
      for (const folderRef of res.prefixes){
        const subF = await listAll(folderRef)
        for (const itemRef of subF.items){
          const path = itemRef.fullPath
          if (path.includes(ageRange)){
            first++;
          }
          if (first == 1){
            const pathReference = ref(storage, itemRef.fullPath)
            const url = await getDownloadURL(pathReference);
            const response = await axios.get(url);
            console.log(url)
  
            response['data']['attributes']['first_name'] = fname
            response['data']['attributes']['last_name'] = lname
            response['data']['attributes']['name'] = fname + " " + lname
  
            response['data']['attributes']['AGE'] = getAge(birthDate)
            response['data']['attributes']['AGE_MONTHS'] = getMonths(birthDate)
            response['data']['attributes']['birthdate'] = getTime(birthDate)
  
            response['data']['attributes']['CNP'] = cnp
            response['data']['attributes']['address'] = addressLocation
  
            console.log(response['data'])
  
            const web3 = window.web3
            const networkId = await web3.eth.net.getId()
            const networkData = Patients.networks[networkId]
            const filesData = Files.networks[networkId]
            const registrationData = Registration.networks[networkId]
            if(networkData) {
                const patientC = new web3.eth.Contract(Patients.abi, networkData.address)
                const filesC = new web3.eth.Contract(Files.abi, filesData.address)
                const registrationC = new web3.eth.Contract(Registration.abi, registrationData.address)
                
                const accounts = await web3.eth.getAccounts()
                
                let encryptionPublicKey;
                try {
                  var result = await window.ethereum.request({
                    method: 'eth_getEncryptionPublicKey',
                    params: [accounts[0]], // you must have access to the specified account
                  });
                  console.log(result);
                  encryptionPublicKey = result;
      
                  const encryptedMessage = ethUtil.bufferToHex(
                    Buffer.from(
                      JSON.stringify(
                        sigUtil.encrypt({
                          publicKey: encryptionPublicKey,
                          data: JSON.stringify(response['data']),
                          version: 'x25519-xsalsa20-poly1305',
                        })
                      ),
                      'utf8'
                    )
                  );
                  const file = new Moralis.File("history.json", {
                    base64: btoa(unescape(encodeURIComponent(JSON.stringify(encryptedMessage)))),
                  });
                  
                  await file.saveIPFS();
  
                  await patientC.methods.registerPatient(
                    fname, lname, gender, addressLocation,
                  city, country, cnp, birthDateConverted, file.hash()
                  ).send({ from: accounts[0] }).on('transactionHash', (hash) => {
                    
                    }).on('error', (e) =>{
                      window.alert('Error')
                    })
                  } catch (error) {
                    if (error.code === 4001) {
                      // EIP-1193 userRejectedRequest error
                      window.alert("We can't store your medical history without the key.");
                    } else {
                      console.error(error);
                    }
                  }
                  navigate("/home")
                }
          }
        }
      }
    }
  }

    return (
    <div style={{overflow: "hidden", height: "100vh", backgroundColor: ""}}>
    <ThemeProvider theme={theme}>
        
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 11,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            position: "relative"
          }}
        >
        <Paper sx={{ width: '100%', overflow: 'hidden'}}>
          <div style={{ width: "50%", float: "left", backgroundColor: "#099057", height: "69.5vh"}}>
            
          </div>
          <div style={{ width: "50%", float: "left", backgroundColor: "white"}}>
          <Typography component="h1" variant="h5" align='center' sx={{ml: 2, mt: 2, fontSize: "30px", fontFamily: "Copperplate"}} >
            Create an account
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3, ml: 2}}>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={6}>
              <CssTextField id="outlined-basic" label="First Name" variant="outlined" id="fname" value={fname}
            onChange={handleFirstNameChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <CssTextField id="outlined-basic" label="Last Name" variant="outlined" id="lname" value={lname}
            onChange={handleLastNameChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <CssTextField id="outlined-basic" label="Country" variant="outlined" id="country" value={country}
            onChange={handleCountryChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <CssTextField id="outlined-basic" label="City" variant="outlined" id="city" value={city}
            onChange={handleCityChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="BirthDate"
                inputFormat="MM/dd/yyyy"
                value={birthDate}
                onChange={handleBirthDateChange}
                renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField id="outlined-basic" select label="Gender" variant="outlined" id="gender" value={gender}
                onChange={handleGenderChange}>
                {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
            </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
              <CssTextField id="outlined-basic" label="Address" variant="outlined" id="addressLocation" value={addressLocation}
            onChange={handleAddressLocationChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <CssTextField id="outlined-basic" label="CNP" variant="outlined" id="cnp" value={cnp}
            onChange={handleCNPChange}/>
              </Grid>
            </Grid>
            <Typography align='center'>
            <Button
              type="submit"
              variant="contained"
              sx={{borderRadius: 5, mt: 3, mb: 2, textTransform: 'none', background: "#099057", width: "150px", ':hover': {
                bgcolor: 'rgb(11,181,109)',
                color: 'white',
              }}}
              onClick={(e) => {handleSubmit(e)}}
            >
              Register
            </Button>
            </Typography>
          </Box>
          </div>
          </Paper>
        </Box>
      </Container>
      
    </ThemeProvider>
    </div>
    );
}

export default Register