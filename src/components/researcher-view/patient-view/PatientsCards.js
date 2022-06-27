import * as React from 'react';
import PatientCard from './PatientCard';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Patients from '../../../abis/Patients.json';
import MedicalResearchers from '../../../abis/MedicalResearchers.json';
import Web3 from 'web3';

const useStyles = makeStyles({
    gridContainer: {
      paddingLeft: "40px",
      paddingRight: "40px"
    }
  });

function PatientsCard(props){
    const classes = useStyles();

    const [patients, setPatients] = React.useState([]);
    
    React.useEffect(() => {
        loadWeb3()
        getPatients()
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


    const getPatients = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Patients.networks[networkId]
        const researcherData = MedicalResearchers.networks[networkId]
        let patientsList = []
    
        if(networkData) {
            const patientsContract = new web3.eth.Contract(Patients.abi, networkData.address)
            const researcherContract = new web3.eth.Contract(MedicalResearchers.abi, researcherData.address)

            const accounts = await web3.eth.getAccounts()
            const patients = await patientsContract.methods.getPatientsAccount().call();
            const patientsOfResearchers = await researcherContract.methods.getPatientsOfAResearcher(accounts[0]).call()
            console.log(patientsOfResearchers)

            for (let i = 0; i < patients.length; i++)
            {
              const patient = await patientsContract.methods.getPatient(patients[i]).call();
               if (!patientsOfResearchers.includes(patient._address)){
                patientsList.push(patient)
              }
            }
        }
        console.log(patientsList)
        setPatients(patientsList)
      }

    return (
        <Grid 
            container
            spacing={2}
            className={classes.gridContainer}
            justify="center"
            >
            {patients.map((patient, i) => (
                <Grid  key={patient._address}  item xs={12} sm={6} md={3}>
                    <PatientCard patient={patient} />
                </Grid>
            ))}
        </Grid> 
    )
}

export default PatientsCard;