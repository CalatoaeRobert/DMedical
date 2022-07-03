import * as React from 'react';
import AppointmentCard from './AppointmentCard';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Appointments from '../../../abis/Appointments.json';
import Hospitals from '../../../abis/Hospitals.json'
import Web3 from 'web3';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function getDate(params) {
    var date = new Date(params * 1000);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    let value = dd + '/' + mm + '/' + yyyy;
    return value;
  }

const useStyles = makeStyles({
    gridContainer: {
      paddingLeft: "40px",
      paddingRight: "40px"
    }
  });

function AppointmentsCards(props){
    const classes = useStyles();

    const [appointments, setAppointments] = React.useState([]);
    const [appointmentsTime, setAppointmentsTime] = React.useState("");
    
    React.useEffect(() => {
        loadWeb3()
        getAppointments()
    }, []);

    React.useEffect(() => {
        getAppointments()
    }, [appointmentsTime]);

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

    function sameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
    }

    const getAppointments = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Appointments.networks[networkId]
        const hospitalsData = Hospitals.networks[networkId]
        let appointmentsList = []

        if(networkData) {
            const appointmentsContract = new web3.eth.Contract(Appointments.abi, networkData.address)
            const hospitalsContract = new web3.eth.Contract(Hospitals.abi, hospitalsData.address)

            const accounts = await web3.eth.getAccounts()
            const appointments = await appointmentsContract.methods.getAppointmentsOfPatient(accounts[0]).call();
            for (let i = 0; i < appointments.length; i++){
                const doctor = await hospitalsContract.methods.getDoctor(appointments[i]['doctor']).call()

                const today = Date.now()
                const todayConverted = new Date(today)

                const date = appointments[i]['date'] * 1000
                const dateConverted = new Date(date)
                const myArray = appointments[i]['startingHour'].split(":");

                if (appointmentsTime == "Past"){
                    if (sameDay(todayConverted, dateConverted)){
                      if (todayConverted.getHours() == parseInt(myArray[0])){
                        if (todayConverted.getMinutes() > parseInt(myArray[1])){
                          let appointment = {}
                          console.log(doctor)
                          appointment.name = doctor['firstName'] + " " + doctor['lastName']
                          appointment.hospital = doctor['hospital']
                          appointment.city = doctor['city']
                          appointment.date = getDate(appointments[i]['date'])
                          appointment.startingHour = appointments[i]['startingHour']
                          appointment.doctorProfile = doctor['_profileHash']
                          appointmentsList.push(appointment)
                        }
                      }
                      else if (todayConverted.getHours() > parseInt(myArray[0])){
                        let appointment = {}
                          console.log(doctor)
                          appointment.name = doctor['firstName'] + " " + doctor['lastName']
                          appointment.hospital = doctor['hospital']
                          appointment.city = doctor['city']
                          appointment.date = getDate(appointments[i]['date'])
                          appointment.startingHour = appointments[i]['startingHour']
                          appointment.doctorProfile = doctor['_profileHash']
                          appointmentsList.push(appointment)
                      }
                    }
                    else{
                      if (today > date){
                          let appointment = {}
                          console.log(doctor)
                          appointment.name = doctor['firstName'] + " " + doctor['lastName']
                          appointment.hospital = doctor['hospital']
                          appointment.city = doctor['city']
                          appointment.date = getDate(appointments[i]['date'])
                          appointment.startingHour = appointments[i]['startingHour']
                          appointment.doctorProfile = doctor['_profileHash']
                          appointmentsList.push(appointment)
                      }
                    }
                  }
                  else{
                    if (sameDay(todayConverted, dateConverted)){
                      if (todayConverted.getHours() == parseInt(myArray[0])){
                        if (todayConverted.getMinutes() > parseInt(myArray[1])){
                          let appointment = {}
                          console.log(doctor)
                          appointment.name = doctor['firstName'] + " " + doctor['lastName']
                          appointment.hospital = doctor['hospital']
                          appointment.city = doctor['city']
                          appointment.date = getDate(appointments[i]['date'])
                          appointment.startingHour = appointments[i]['startingHour']
                          appointment.doctorProfile = doctor['_profileHash']
                          appointmentsList.push(appointment)
                        }
                      }
                      else if (todayConverted.getHours() < parseInt(myArray[0])){
                        let appointment = {}
                          console.log(doctor)
                          appointment.name = doctor['firstName'] + " " + doctor['lastName']
                          appointment.hospital = doctor['hospital']
                          appointment.city = doctor['city']
                          appointment.date = getDate(appointments[i]['date'])
                          appointment.startingHour = appointments[i]['startingHour']
                          appointment.doctorProfile = doctor['_profileHash']
                          appointmentsList.push(appointment)
                      }
                    }
                    else{
                      if (today < date){
                        let appointment = {}
                        console.log(doctor)
                        appointment.name = doctor['firstName'] + " " + doctor['lastName']
                        appointment.hospital = doctor['hospital']
                        appointment.city = doctor['city']
                        appointment.date = getDate(appointments[i]['date'])
                        appointment.startingHour = appointments[i]['startingHour']
                        appointment.doctorProfile = doctor['_profileHash']
                        appointmentsList.push(appointment)
                      }
                    }
                  }
            }
            console.log(appointmentsList) 
            setAppointments(appointmentsList)
            // for (let i = 0; i < doctors.length; i++)
            // {
            // const doctor = await hospitalC.methods.getDoctor(doctors[i]).call();
            // doctorsList.push(doctor)
            // }
        }
        // setDoctors(doctorsList)
    }

    const time = [
        {
          value: 'Past',
          label: 'Past',
        },
        {
          value: 'Future',
          label: 'Future',
        }
      ];

      const handleTimeChange = (newValue) => {
        setAppointmentsTime(newValue.target.value);
      };

    return (
        <div>
            <div>
            <TextField id="outlined-basic" select label="Appointments" variant="outlined" id="gender" value={appointmentsTime}
            onChange={handleTimeChange} sx={{width: "150px", marginLeft: "40px", marginTop: "10px"}}>
              {time.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
        </div>
        <div>
             <Grid 
            container
            spacing={2}
            className={classes.gridContainer}
            justify="center"
            sx={{marginTop: "5px"}}
            >
            {appointments.map((appointment, i) => (
                <Grid key={i} item xs={12} sm={6} md={3}>
                    <AppointmentCard appointment={appointment} profilePic={`https://ipfs.moralis.io:2053/ipfs/${appointment.doctorProfile}`}/>
                </Grid>
            ))}
        </Grid>
        </div>
        </div>
        
        
    )
}

export default AppointmentsCards;