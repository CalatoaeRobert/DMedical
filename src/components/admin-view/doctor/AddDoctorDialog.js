import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Web3 from 'web3';
import Hospitals from '../../../abis/Hospitals.json';
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


import { useMoralis } from "react-moralis";
import { useMoralisQuery } from "react-moralis";
// import Moralis from 'moralis/types';


export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);


  
  const startMoralis = async () => {
    await Moralis.enableWeb3();
    Moralis.start({appId: appId, serverURL:serverUrl});
   
  }

  const handleClickOpen = () => {
    setOpen(true);
    getCountries();
    getSpecializations();
    //basicQuery()
  };

  // const { fetch } = Moralis.query(
  //   "Hospitals",
  //   (query) => query.distinct("country"),
  //   [],
  //   { autoFetch: false }
  // );

  // const basicQuery = async () => {
  //   const results = await fetch();
  //   console.log(results)
  //   // Do something with the returned Moralis.Object values
  //   for (let i = 0; i < results.length; i++) {
  //     const object = results[i];
  //     // alert(object.id + " - " + object.get("ownerName"));
  //   }
  // };

  const handleClose = () => {
    setOpen(false);
  };
  
  const addDoctorListener = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Hospitals.networks[networkId]
    const registrationData = Registration.networks[networkId]
    if(networkData) {
        const hospitalC = new web3.eth.Contract(Hospitals.abi, networkData.address)
        const registrationC = new web3.eth.Contract(Registration.abi, registrationData.address)
        const accounts = await web3.eth.getAccounts()
        console.log(walletAddress)

        //upload ipfs
        const fileIpfs = new Moralis.File(file.name, file);
        await fileIpfs.saveIPFS();

        console.log(fileIpfs.ipfs(), fileIpfs.hash())

        await hospitalC.methods.addDoctorToSystem({
          firstName: fname, lastName:lname, birthDate:birthDateConverted, gender:gender, country:country,
        city: city, hospital:hospital, specialization:specialization, 
        skills:skillsSelected, walletAddress:walletAddress, cnp:cnp, _profileHash:fileIpfs.hash()
        }
        ).send({ from: accounts[0] }).on('transactionHash', (hash) => {
          window.location.reload()
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
           
          })
        // await registrationC.methods.addDoctor(walletAddress).send({ from: accounts[0] }).on('transactionHash', (hash) => {
         
        // })
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

  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [birthDate, setBirthDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const [birthDateConverted, setBirthDateConverted] = React.useState(0)

  const [country, setCountry] = React.useState("");
  const [countries, setCountries] = React.useState([]);

  const [city, setCity] = React.useState("");
  const [cities, setCities] = React.useState([]);

  const [hospital, setHospital] = React.useState("");
  const [hospitals, setHospitals] = React.useState([]);

  const [specialization, setSpecialization] = React.useState("");
  const [specializations, setSpecializations] = React.useState([]);

  const [skills, setSkills] = React.useState([]);
  const [skillsSelected, setSkillsSelected] = React.useState([]);
  const [skillsMoralis, setSkillsMoralis] = React.useState([]);

  const [gender, setGender] = React.useState("Male");
  const [address, setAddress] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");
  const [cnp, setCNP] = React.useState("");

  const [filename, setFilename] = React.useState("");
  const [buffer, setBuffer] = React.useState("");
  const [file, setFile] = React.useState({});

  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();

  const serverUrl = "https://y6jxsxjnbbo1.usemoralis.com:2053/server"
  const appId =  "L1N8KnhXQYCKoJyeRd95qZf1will3QM0DE8YzlJS"
  Moralis.start({ serverUrl, appId});
  

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

  const handleHospitalChange = (newValue) => {
    setHospital(newValue.target.value);
  };

  const handleGenderChange = (newValue) => {
    setGender(newValue.target.value);
  };

  const handleAddressChange = (newValue) => {
    setAddress(newValue.target.value);
  };

  const handleWalletAddressChange = (newValue) => {
    setWalletAddress(newValue.target.value);
  };

  const handleCNPChange = (newValue) => {
    setCNP(newValue.target.value);
  };

  const handleSpecializationChange = (newValue) => {
    setSpecialization(newValue.target.value);
  };

  const handleSkillsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSkillsSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
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

  React.useEffect(() => {
    console.log("sad")
    getCities()
  }, [country])

  React.useEffect(() => {
    console.log("sad")
    getHospitalsFromMoralis()
  }, [city])

  React.useEffect(() => {
    console.log("changeSkills")
    getSkills()
  }, [specialization])

  const getSkills = async () => {
    for (let i = 0; i < specializations.length; i++)
    {
      if (specializations[i]['name'] == specialization){
        console.log(specializations[i]['skills'])
        console.log(skills)
        setSkills(specializations[i]['skills'])
      }
    }
  }

  // React.useEffect(() => {
  //   console.log("spec")
  //   for (let i = 0; i < specializations.length; i++)
  //   {
  //     if (specializations[i]['name'] == specialization){
  //       console.log(specializations[i]['skills'])
  //       setSkills(specialization[i]['skills'])
  //     }
  //   }
  //   // setSkills(specializations[specialization])
  //   console.log(skills)
  // }, [specialization, specializations])

  const getCountries = async () => {
    const results = await Moralis.Cloud.run("getCountriesAg");
    // console.log(results)
    let countriesResults = [];
    for (let i = 0; i < results.length; i++) {
      const country = results[i];
      countriesResults.push({value: country['objectId'], label: country['objectId']})
    }
    setCountries(countriesResults)
    console.log(countries)
  }

  const getCities = async () => {
    const results = await Moralis.Cloud.run("getCities", {country: country});
    // console.log(results)
    let cities = [];
    let citiesResult = [];
    for (let i = 0; i < results.length; i++) {
      const city = results[i];
      console.log(city)
      if (!cities.includes(city["city"])){
        cities.push(city["city"])
      }
      // citiesResult.push({value: city['objectId'], label: city['objectId']})
    }
    cities.sort()
    for (let i = 0; i < cities.length; i++){
      citiesResult.push({value: cities[i], label: cities[i]})
    }
    citiesResult.sort()
    setCities(citiesResult)
    console.log(cities)
  }

  const getHospitalsFromMoralis = async () => {
    const results = await Moralis.Cloud.run("getHospitals", {city: city});
    // console.log(results)
    let hospitals = [];
    let hospitalsResult = [];
    for (let i = 0; i < results.length; i++) {
      const hospital = results[i];
      console.log(hospital)
      if (!hospitals.includes(hospital["name"])){
        hospitals.push(hospital["name"])
      }
      // citiesResult.push({value: city['objectId'], label: city['objectId']})
    }
    hospitals.sort()
    for (let i = 0; i < hospitals.length; i++){
      hospitalsResult.push({value: hospitals[i], label: hospitals[i]})
    }
    hospitalsResult.sort()
    setHospitals(hospitalsResult)
    console.log(hospitals)
  }

  const getSpecializations = async () => {
    const results = await Moralis.Cloud.run("getSpecializations");
    console.log(results)
    let specializationResult = []
    for (let i = 0; i < results.length; i++) {
      const specialization = results[i];
      specializationResult.push({name: specialization["name"], skills: specialization["skills"]})
    }
    console.log(specializationResult)
    setSpecializations(specializationResult)
    // console.log(specializations)
  }

  const captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    console.log(typeof(file))
    const reader = new window.FileReader()
    setFile(file)
    setFilename(file.name)
    // reader.readAsArrayBuffer(file)
    // reader.onloadend = () => {
    //   setBuffer(Buffer(reader.result))
    //   setFilename(file.name)
    // }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{textTransform: 'none', mt: 1.5, ml: props.open ? 3:9}}>
        ADD DOCTOR
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a doctor</DialogTitle>
        <DialogContent>
          <Box
              component="form"
              sx={{
                '& > :not(style)': { mt: 1, width: '45ch' },
              }}
              noValidate
              autoComplete="off"
            >
            <TextField id="outlined-basic" label="First Name" variant="outlined" id="fname" value={fname}
            onChange={handleFirstNameChange}/>
            <TextField id="outlined-basic" label="Last Name" variant="outlined" id="lname" value={lname}
            onChange={handleLastNameChange}/>
            {/* <TextField id="outlined-basic" label="Country" variant="outlined" id="country" value={country}
            onChange={handleCountryChange}/> */}
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
            <TextField id="outlined-basic" select label="Country" variant="outlined" id="country" value={country}
            onChange={handleCountryChange}>
              {countries.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
            <TextField id="outlined-basic" select label="City" variant="outlined" id="city" value={city}
            onChange={handleCityChange}>
              {cities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
            <TextField id="outlined-basic" select label="Hospital" variant="outlined" id="hospital" value={hospital}
            onChange={handleHospitalChange}>
              {hospitals.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
            <TextField id="outlined-basic" select label="Specialization" variant="outlined" id="specialization" value={specialization}
            onChange={handleSpecializationChange}>
              {specializations.map((option) => (
            <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
            ))}
            </TextField>
            <InputLabel id="demo-multiple-checkbox-label">Skills</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={skillsSelected}
              onChange={handleSkillsChange}
              notched={true}
              input={<OutlinedInput label="Skills" />}
              renderValue={(selected) =>  {
               
                return selected.join(', ');
              }}
            >
             {skills.map((option) => (
              
              <MenuItem key={option} value={option}>
              <Checkbox checked={skillsSelected.indexOf(option) > -1} />
              <ListItemText primary={option} />
          </MenuItem>
            ))}
            </Select>
            <TextField id="outlined-basic" label="Address" variant="outlined" id="address" value={address}
            onChange={handleAddressChange}/>
            <TextField id="outlined-basic" label="Wallet Address" variant="outlined" id="walletAddress" value={walletAddress}
            onChange={handleWalletAddressChange}/>
            <TextField id="outlined-basic" label="CNP" variant="outlined" id="cnp" value={cnp}
            onChange={handleCNPChange}/>
            <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={captureFile}
          />
          <div style={{display: "flex", flexFlow: "row"}}>
          <InputLabel sx={{mt: 1, mr: 2}}>{filename}</InputLabel>
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Choose Profile Picture
            </Button>
          </label>
          </div>
           
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={addDoctorListener}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
