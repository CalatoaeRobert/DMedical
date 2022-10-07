import * as React from 'react';
import isWeekend from 'date-fns/isWeekend';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Hospitals from '../../../abis/Hospitals.json';
import Web3 from 'web3';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Appointments from '../../../abis/Appointments.json';

import { useMoralis } from "react-moralis";
import { useMoralisQuery } from "react-moralis";

const useStyles = makeStyles({
    gridContainer: {
      paddingLeft: "10px",
      paddingRight: "40px"
    }
  });


export default function AppointmentForm(props) {
  const [value, setValue] = React.useState(new Date());
  const [appointmentDate, setAppointmentDate] = React.useState(new Date());
  const [startIntervals, setStartIntervals] = React.useState(["8:00", "9:30", "10:30", "11:30", "14:00", "15:00", "17:30", "19:30"])
  const [startInterval, setStartInterval] = React.useState("10:30")
  const [selectedBtn, setSelectedBtn] = React.useState(-1);

  const [hospitalName, setHospitalName] = React.useState("");
  const [hospitalLocation, setHospitalLocation] = React.useState([51.505, -0.09]);

  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();

  const classes = useStyles();

  const handleInterval = (event, newInterval) => {
     
    setStartInterval(event);
    console.log(startInterval)
  };

  const handleHourChange = (event, newInterval) => {
    setStartInterval(newInterval)
    };

    const handleDateChange = (newValue) => {
        let date = (new Date(newValue)).getTime() / 1000;
        setValue(newValue);
        setAppointmentDate(date)
        setStartingHours()
    };

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

    const setHospitalLocationAndName = async () => {
        let search = window.location.search;
        const params = new URLSearchParams(search);
        const doctorAddress = params.get('doctor')

        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Hospitals.networks[networkId]
        if(networkData) {
            const hospitalContract = new web3.eth.Contract(Hospitals.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()

            let doctor = await hospitalContract.methods.getDoctor(doctorAddress).call()
            console.log(doctor)
            const results = await Moralis.Cloud.run("getHospitalByName", {name: doctor['hospital']});
            setHospitalName(results[0]['name'])
            setHospitalLocation([results[0]['LAT'], results[0]['LON']])
            console.log(results[0])
        }
    }

    const setStartingHours = async () => {
        let search = window.location.search;
        const params = new URLSearchParams(search);
        const doctorAddress = params.get('doctor')

        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Appointments.networks[networkId]
        if(networkData) {
            const appointmentsContract = new web3.eth.Contract(Appointments.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()

            var date = new Date(appointmentDate * 1000);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); 
            var yyyy = date.getFullYear();
            let value = dd + '/' + mm + '/' + yyyy;

            let appointments = await appointmentsContract.methods.getAppointmentsInADay(doctorAddress, value).call()
            console.log(appointments)

            let hours = ["8:00", "9:30", "10:30", "11:30", "14:00", "15:00", "17:30", "19:30"]
            for (let i = 0; i < appointments.length; i++)
            {
                const index = hours.indexOf(appointments[i]);
                console.log(appointments[i])
                if (index > -1) {
                    hours.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            setStartIntervals(hours)
        }
    }

    React.useEffect(() => {
        loadWeb3()
        setStartingHours()
        setHospitalLocationAndName()
    }, [])

    React.useEffect(() => {
        setStartingHours()
    }, [value])

    function SetViewOnClick({ coords }) {
        const map = useMap();
        map.setView(hospitalLocation, 13);

        return null;
      }
      

    const addAppointment = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Appointments.networks[networkId]
        if(networkData) {
            const appointmentContract = new web3.eth.Contract(Appointments.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()
            
            let search = window.location.search;
            const params = new URLSearchParams(search);
            const doctorAddress = params.get('doctor')

            var date = new Date(appointmentDate * 1000);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); 
            var yyyy = date.getFullYear();
            let value = dd + '/' + mm + '/' + yyyy;
            await appointmentContract.methods.addAppointment({
            patient: accounts[0], doctor:doctorAddress, date:appointmentDate, startingHour:startInterval, dateString: value}
            ).send({ from: accounts[0] }).on('transactionHash', (hash) => {
            }).on('error', (e) =>{
                window.alert('Error')
                // this.setState({loading: false})
            })
        }
    }

  return (
      <div>
          
          <div style={{width: "50%", float: "left"}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
                orientation="landscape"
                openTo="day"
                disablePast
                value={value}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
            <FormControl>
                    <Grid 
                    container
                    spacing={2}
                    className={classes.gridContainer}
                    justify="center">
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{marginTop: "20px", marginLeft: "20px"}}>Starting Hour</FormLabel>
                        <RadioGroup
                        sx={{marginLeft: "20px"}}
                        onChange={handleHourChange}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group">
                            {startIntervals.map((interval) => (
                            <Grid key={interval} item xs={12} sm={6} md={3}>
                                <FormControlLabel value={interval} control={<Radio />} label={interval} />
                            </Grid>
                            ))}
                        </RadioGroup>
                    </Grid>
            </FormControl>
            <Button variant='contained' sx={{marginLeft: "10px"}} onClick={addAppointment}>Add appointment</Button>
            </div>
            <div style={{height: "20%", width: "50%", float: "left"}}>
           
           <MapContainer style={{ height: '70vh', width: '100wh' }} center={hospitalLocation} zoom={13} scrollWheelZoom={true}>
           <SetViewOnClick center={hospitalLocation}/> 
           <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           />
           <Marker position={hospitalLocation} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
               <Popup>
               {hospitalName}
               </Popup>
           </Marker>
           </MapContainer>
           
            </div>
      </div>

  );
}
