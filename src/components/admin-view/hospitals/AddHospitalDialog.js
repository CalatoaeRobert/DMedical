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
  const [countries, setCountries] = React.useState([]);

  const [city, setCity] = React.useState("");
  const [cities, setCities] = React.useState([]);

  const [zip, setZip] = React.useState(0);
  const [lon, setLon] = React.useState(0);
  const [lat, setLat] = React.useState(0);

  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();

  const serverUrl = "https://y6jxsxjnbbo1.usemoralis.com:2053/server"
  const appId =  "L1N8KnhXQYCKoJyeRd95qZf1will3QM0DE8YzlJS"
  Moralis.start({ serverUrl, appId});
  

  const handleNameChange = (newValue) => {
    setName(newValue.target.value);
  };

  const handleZipChange = (newValue) => {
    setZip(newValue.target.value);
  };

  const handleLatChange = (newValue) => {
    setLat(newValue.target.value);
  };

  const handleLonChange = (newValue) => {
    setLon(newValue.target.value);
  };

  const handleCityChange = (newValue) => {
    setCity(newValue.target.value);
  };

  const handleCountryChange = (newValue) => {
    setCountry(newValue.target.value);
  };

  React.useEffect(() => {
    console.log("sad")
    getCities()
  }, [country])

  const addHospitalListener = async () => {
    const hospital = new Moralis.Object("Hospitals");
    hospital.set("name", name)
    hospital.set("city", city)
    hospital.set("country", country)
    hospital.set("zip", parseInt(zip))
    hospital.set("LAT", parseFloat(lat))
    hospital.set("LON", parseFloat(lon))
    hospital.save().then(() => {
      window.confirm("You added a new hospital")
    })

    setOpen(false);

    
  };

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

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{textTransform: 'none', mt: 1.5, ml: props.open ? 3:9}}>
        ADD HOSPITAL
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a hospital</DialogTitle>
        <DialogContent>
          <Box
              component="form"
              sx={{
                '& > :not(style)': { mt: 1, width: '45ch' },
              }}
              noValidate
              autoComplete="off"
            >
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
            <TextField id="outlined-basic" label="Name" variant="outlined" id="name" value={name}
            onChange={handleNameChange}/>
            <TextField id="outlined-basic" label="ZIP" variant="outlined" id="zip" value={zip}
            onChange={handleZipChange}/>
            <TextField id="outlined-basic" label="LAN" variant="outlined" id="lat" value={lat}
            onChange={handleLatChange}/>
            <TextField id="outlined-basic" label="LON" variant="outlined" id="lon" value={lon}
            onChange={handleLonChange}/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={addHospitalListener}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
