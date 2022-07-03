import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Appointments from '../../../abis/Appointments.json';
import Hospitals from '../../../abis/Hospitals.json'
import Patients from '../../../abis/Patients.json'
import Files from '../../../abis/Files.json'
import MedicalResearchers from '../../../abis/MedicalResearchers.json'
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Button from '@mui/material/Button';
import { useMoralis } from "react-moralis";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');


export default function InvitationsTable() {
  const [invitations, setInvitations] = React.useState([])
  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();
  const [role, setRole] = React.useState("")

  React.useEffect(() => {
    loadWeb3() 
  }, [])

  React.useEffect(() => {
    getInvitations()
  }, [role])

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

    const acceptHistoryAccess = async (e, row) => {
  
      const web3 = window.web3
      const networkId = await web3.eth.net.getId()
      const networkData = Appointments.networks[networkId]
      const patientData = Patients.networks[networkId]
      const hospitalData = Hospitals.networks[networkId]
      const filesData = Files.networks[networkId]
      const researcherData = MedicalResearchers.networks[networkId]

      const accounts = await web3.eth.getAccounts()
      if(networkData) {
          const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)
          const patientContract = new web3.eth.Contract(Patients.abi, patientData.address)
          const hospitalContract = new web3.eth.Contract(Hospitals.abi, hospitalData.address)
          const filesContract = new web3.eth.Contract(Files.abi, filesData.address)
          const researcherContract = new web3.eth.Contract(MedicalResearchers.abi, researcherData.address)
          
          if (typeof row['walletAddress'] !== 'undefined'){
            console.log(row['walletAddress'])
            const encryptionKey = await hospitalContract.methods.getEncryptionPublicKey(row['walletAddress']).call()
            console.log(encryptionKey)
      
            const patient = await patientContract.methods.getPatient(accounts[0]).call()
            console.log(patient['_hash'])
      
            const url = `https://ipfs.moralis.io:2053/ipfs/${patient['_hash']}`;
            const response = await fetch(url);
            response.json().then((historyEncrypted) => {
              
              window.ethereum
              .request({
                method: 'eth_decrypt',
                params: [historyEncrypted, accounts[0]],
              })
              .then((decryptedHistory) =>{
                const encryptedMessage = ethUtil.bufferToHex(
                  Buffer.from(
                    JSON.stringify(
                      sigUtil.encrypt({
                        publicKey: encryptionKey,
                        data: JSON.stringify(decryptedHistory),
                        version: 'x25519-xsalsa20-poly1305',
                      })
                    ),
                    'utf8'
                  )
                );
                const file = new Moralis.File("history.json", {
                  base64: btoa(unescape(encodeURIComponent(JSON.stringify(encryptedMessage)))),
                });
                file.saveIPFS().then(() => {
                  console.log(row['walletAddress'])
                  filesContract.methods.acceptRequestFromDoctor(row['walletAddress'], row['index'], file.hash()).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                  }).on('error', (e) =>{
                    window.alert('Error')
                    // this.setState({loading: false})
                  
                  }).then(() => {filesContract.methods.addFilesToDoctor(row['walletAddress'], file.hash()).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                  }).on('error', (e) =>{
                    window.alert('Error')
                    // this.setState({loading: false})
                  
                  }).then(() => {})})
                  
                });
              }
              )
              .catch((error) => console.log(error.message));
            })
          }
          else {
            console.log(row)
            const encryptionKey = await researcherContract.methods.getEncryptionPublicKey(row['_address']).call()
            console.log(encryptionKey)
      
            const patient = await patientContract.methods.getPatient(accounts[0]).call()
            console.log(patient['_hash'])
      
            const url = `https://ipfs.moralis.io:2053/ipfs/${patient['_hash']}`;
            const response = await fetch(url);
            response.json().then((historyEncrypted) => {
              
              window.ethereum
              .request({
                method: 'eth_decrypt',
                params: [historyEncrypted, accounts[0]],
              })
              .then((decryptedHistory) =>{
                const encryptedMessage = ethUtil.bufferToHex(
                  Buffer.from(
                    JSON.stringify(
                      sigUtil.encrypt({
                        publicKey: encryptionKey,
                        data: JSON.stringify(decryptedHistory),
                        version: 'x25519-xsalsa20-poly1305',
                      })
                    ),
                    'utf8'
                  )
                );
                const file = new Moralis.File("history.json", {
                  base64: btoa(unescape(encodeURIComponent(JSON.stringify(encryptedMessage)))),
                });
                file.saveIPFS().then(() => {
                  console.log(row['_address'])
                  researcherContract.methods.acceptRequestFromResearcher(row['_address'], row['index'], file.hash()).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                  }).on('error', (e) =>{
                    window.alert('Error')
                    // this.setState({loading: false})
                  
                  }).then(() => {researcherContract.methods.addFilesToResearcher(row['_address'], file.hash()).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                  }).on('error', (e) =>{
                    window.alert('Error')
                    // this.setState({loading: false})
                  
                  }).then(() => {})})
                  
                });
              }
              )
              .catch((error) => console.log(error.message));
            })
          }
      }
    }
    
    const declineHistoryAccess = async (e, row) => {
      
      const web3 = window.web3
      const networkId = await web3.eth.net.getId()
      const networkData = Files.networks[networkId]
      const accounts = await web3.eth.getAccounts()
      if(networkData) {
          const filesContract = new web3.eth.Contract(Files.abi, networkData.address)
    
          await filesContract.methods.acceptRequestFromDoctor(row['_address']).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
            
          })
      }
    }
    
    const renderDetailsButton = (params) => {
      return (
          <strong>
              <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginLeft: 16 }}
                  onClick={(e) => {acceptHistoryAccess(e, params.row)}}
              >
                  Accept
              </Button>
              <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{ marginLeft: 16 }}
                  onClick={(e) => {declineHistoryAccess(e, params.row)}}
              >
                  Decline
              </Button>
          </strong>
      )
    }
    
    const columns = [
      {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
      },
      {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
      },
      {
        field: 'hospital',
        headerName: 'Hospital',
        width: 300,
        renderCell: renderCellExpand
      },
      {
        field: 'specialization',
        headerName: 'Specialization',
        width: 150,
        renderCell: renderCellExpand
      },
      {
        field: 'history',
        headerName: 'History Access Approval',
        width: "250",
        renderCell: renderDetailsButton 
      },
    ];

    const columnsResearchers = [
      {
        field: 'name',
        headerName: 'Name',
        width: 150,
      },
      {
        field: 'country',
        headerName: 'Country',
        width: 150,
      },
      {
        field: 'city',
        headerName: 'City',
        width: 300,
      },
      {
        field: 'nrOfPatients',
        headerName: 'Number of patients',
        width: 150,
      },
      {
        field: 'history',
        headerName: 'History Access Approval',
        width: "250",
        renderCell: renderDetailsButton 
      },
    ];
    

  const getInvitations = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Files.networks[networkId]
    const hospitalData = Hospitals.networks[networkId]
    const researcherData = MedicalResearchers.networks[networkId]
    let invitationsList = []
    if (role == "doctors"){
      if(networkData) {
        const filesContract = new web3.eth.Contract(Files.abi, networkData.address)
        const hospitalContract = new web3.eth.Contract(Hospitals.abi, hospitalData.address)

        const accounts = await web3.eth.getAccounts()
        const requests = await filesContract.methods.getRequestsOfAPatient(accounts[0]).call();
        console.log(requests)
        for (let i = 0; i < requests.length; i++)
        {
          if (requests[i]['doctor'] != '0x0000000000000000000000000000000000000000'){
            const doctor = await hospitalContract.methods.getDoctor(requests[i]['doctor']).call();
            const newObj = Object.assign({selected: false}, doctor);
            newObj['index'] = requests[i]['index']
            invitationsList.push(newObj)
          }
        }
      }
      setInvitations(invitationsList)
    }
    else{
        const researcherContract = new web3.eth.Contract(MedicalResearchers.abi, researcherData.address)
        const hospitalContract = new web3.eth.Contract(Hospitals.abi, hospitalData.address)

        const accounts = await web3.eth.getAccounts()
        const requests = await researcherContract.methods.getRequestsOfAResearcher(accounts[0]).call();
        console.log(requests)
        for (let i = 0; i < requests.length; i++)
        {
          if (requests[i]['researcher'] != '0x0000000000000000000000000000000000000000'){
            const researcher = await researcherContract.methods.getResearcher(requests[i]['researcher']).call();
            const newObj = Object.assign({selected: false}, researcher);
            newObj['index'] = requests[i]['index']
            invitationsList.push(newObj)
          }
        }
        setInvitations(invitationsList)
    }
  }

  const roles = [
    {
      value: 'doctors',
      label: 'Doctors',
    },
    {
      value: 'medicalResearchers',
      label: 'Medical Researchers',
    }
  ];

  const handleRoleChange = (newValue) => {
    console.log(newValue.target.value)
    setRole(newValue.target.value);
  };

  function Tables() {
    if (role=="doctors") {
      return <DataGrid
        rows={invitations}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        getRowId={(row) => row.index}
      />;
    }
    else{
      return <DataGrid
      rows={invitations}
      columns={columnsResearchers}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 25]}
      disableSelectionOnClick
      getRowId={(row) => row.index}
    />;
    }
  }

  return (
    <div>
      <div>
            <div>
            <TextField id="outlined-basic" select label="Role" variant="outlined" id="role" value={role}
            onChange={handleRoleChange} sx={{width: "150px", marginBottom: "5px",marginTop: "5px"}}>
              {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
            ))}
            </TextField>
        </div>
    </div>
    <div style={{ height: 450, width: '100%' }}>
      <Tables />
    </div>
    </div>
  );
}