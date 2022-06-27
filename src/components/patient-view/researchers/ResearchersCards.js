import * as React from 'react';
// import AppointmentCard from './AppointmentCard';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Appointments from '../../../abis/Appointments.json';
import Hospitals from '../../../abis/Hospitals.json'
import Patients from '../../../abis/Patients.json'
import Web3 from 'web3';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

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

function ResearchersCards(props){
    const classes = useStyles();

    const [researchers, setResearchers] = React.useState([]);
    const [price, setPrice] = React.useState("");
    
    React.useEffect(() => {
        loadWeb3()
        getPrice()
        //getAppointments()
    }, []);

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

    const getPrice = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Patients.networks[networkId]

        if(networkData) {
            const patientContract = new web3.eth.Contract(Patients.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()
            const priceHistory = await patientContract.methods.getPrice(accounts[0]).call();
            setPrice(priceHistory)
            console.log(priceHistory)
        }
    }

    const changePriceHistory = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Patients.networks[networkId]

        if(networkData) {
            const patientContract = new web3.eth.Contract(Patients.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()
            await patientContract.methods.changePrice(accounts[0], price).
            send({ from: accounts[0] }).on('transactionHash', (hash) => {
            }).on('error', (e) =>{
                window.alert('Error')
                // this.setState({loading: false})
            })
        }
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

                if (appointmentsTime == "Past"){
                    if ((today > (appointments[i]['date'] * 1000))){
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
                    console.log(today)
                    console.log(appointments[i]['date'])
                    if ((today < (appointments[i]['date'] * 1000))){
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

      const handlePriceChange = (newValue) => {
        console.log(newValue.target.value)
        setPrice(newValue.target.value);
      };

    return (
        <div>
            <div style={{float: "left"}}>
                <TextField id="outlined-basic" label="Price(ETH)" variant="outlined" value={price}
                onChange={handlePriceChange}  sx={{width: "150px", marginLeft: "40px", marginTop: "10px"}}>
                </TextField>
            </div>
            <div style={{float: "left"}}>
                <Button variant='contained' sx={{marginLeft: "10px", marginTop: "18px"}} onClick={changePriceHistory}>Change</Button>
            </div>
        <div>
             <Grid 
            container
            spacing={2}
            className={classes.gridContainer}
            justify="center"
            sx={{marginTop: "5px"}}
            >
            {/* {appointments.map((appointment, i) => (
                <Grid key={i} item xs={12} sm={6} md={3}>
                    <AppointmentCard appointment={appointment} profilePic={`https://ipfs.moralis.io:2053/ipfs/${appointment.doctorProfile}`}/>
                </Grid>
            ))} */}
        </Grid>
        </div>
        </div>
        
        
    )
}

export default ResearchersCards;