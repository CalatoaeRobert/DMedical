import * as React from 'react';
import DoctorCard from '../DoctorCard';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Hospitals from '../../../abis/Hospitals.json';
import Web3 from 'web3';

const useStyles = makeStyles({
    gridContainer: {
      paddingLeft: "40px",
      paddingRight: "40px"
    }
  });

function DoctorsCards(props){
    const classes = useStyles();

    const [doctors, setDoctors] = React.useState([]);

    
    React.useEffect(() => {
        loadWeb3()
        getDoctors()
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


    const getDoctors = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Hospitals.networks[networkId]

        let doctorsList = []

        if(networkData) {
            const hospitalC = new web3.eth.Contract(Hospitals.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()
            const doctors = await hospitalC.methods.getDoctors().call();
            
            for (let i = 0; i < doctors.length; i++)
            {
            const doctor = await hospitalC.methods.getDoctor(doctors[i]).call();
            doctorsList.push(doctor)
            }
        }
        console.log(doctorsList)
        setDoctors(doctorsList)
    }

    return (
        <Grid 
            container
            spacing={2}
            className={classes.gridContainer}
            justify="center"
            >
            {doctors.map((doctor) => (
                <Grid  key={doctor.walletAddress}  item xs={12} sm={6} md={3}>
                    <DoctorCard doctor={doctor} profilePic={`https://ipfs.moralis.io:2053/ipfs/${doctor._profileHash}`}/>
                </Grid>
            ))}
        </Grid> 
    )
}

export default DoctorsCards;