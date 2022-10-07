import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from "react-router-dom";
import MedicalResearchers from '../../../abis/MedicalResearchers.json';
import Web3 from 'web3';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function PatientCard(props) {
  const navigate = useNavigate();

  function getBirthDate(params) {
    var date = new Date(params * 1000);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    let value = dd + '/' + mm + '/' + yyyy;
    return value;
  }

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


    const buyMedicalHistory = async () => {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const researcherData = MedicalResearchers.networks[networkId]
      
        if(researcherData) {
            const researcherContract = new web3.eth.Contract(MedicalResearchers.abi, researcherData.address)

            const accounts = await web3.eth.getAccounts()

            const researcher = await researcherContract.methods.getResearcher(accounts[0]).call()
            const nrOfPatients = researcher['nrOfPatients']
            if (nrOfPatients == 0){
              var result = await window.ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [accounts[0]], // you must have access to the specified account
              });
              console.log(result);
              await researcherContract.methods.addEncryptionKey(result).send({ from: accounts[0]}).on('transactionHash', (hash) => { 
              }).on('error', (e) =>{
                window.alert('Error')
                // this.setState({loading: false})
                
              })
            }
          await researcherContract.methods.addRequest(props.patient._address, accounts[0]).send({ from: accounts[0]}).on('transactionHash', (hash) => { 
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
            
          })

          
          console.log(nrOfPatients)
      }
    }

  return (
    <Card key={props.patient._address}>
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          PATIENT NAME
        </Typography>
        <Typography style={{display: 'inline-block'}}>
         {props.patient.firstName} {props.patient.lastName} 
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Country
        </Typography>
        <Typography variant="body2">
            {props.patient.country}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          City
        </Typography>
        <Typography variant="body2">
            {props.patient.city}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Birth Date
        </Typography>
        <Typography variant="body2">
          {getBirthDate(props.patient.birthDate)}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Address
        </Typography>
        <Typography variant="body2">
          {props.patient._addressLocation}
        </Typography>
        <CardActions style={{justifyContent: 'center'}}>
        <Button size="small" variant="contained" sx={{mt: 1}} onClick={buyMedicalHistory}>Ask for medical history</Button>
      </CardActions>
      </CardContent>
    </Card>
  )
}