import * as React from 'react';
import ResearcherCard from './ResearcherCard';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Appointments from '../../../abis/Appointments.json';
import Hospitals from '../../../abis/Hospitals.json'
import Patients from '../../../abis/Patients.json'
import MedicalReseachers from '../../../abis/MedicalResearchers.json'
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
    
    React.useEffect(() => {
        loadWeb3()
        getResearchers()
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

    const getResearchers = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = MedicalReseachers.networks[networkId]
        const patientData = Patients.networks[networkId]
        
        let researcherList = []

        if (networkData){
            const researcherContract = new web3.eth.Contract(MedicalReseachers.abi, networkData.address)
            const patientContract = new web3.eth.Contract(Patients.abi, patientData.address)

            const accounts = await web3.eth.getAccounts()

            const researchersL = await researcherContract.methods.getResearchersOfPatient(accounts[0]).call()
            for (let i = 0; i < researchersL.length; i++){
                const researcher = await researcherContract.methods.getResearcher(researchersL[i]).call()
                researcherList.push(researcher)
            }
            setResearchers(researcherList) 
        }
    }

    return (
        
        <Grid 
        container
        spacing={2}
        className={classes.gridContainer}
        justify="center"
        
        >
        {researchers.map((researcher, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
                <ResearcherCard researcher={researcher} />
            </Grid>
        ))}
        </Grid>

    )
}

export default ResearchersCards;