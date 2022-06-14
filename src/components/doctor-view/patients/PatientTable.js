import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Appointments from '../../../abis/Appointments.json';
import Patients from '../../../abis/Patients.json';
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Button from '@mui/material/Button';


export default function DataGridDemo() {
  const [patients, setPatients] = React.useState([])
  const [historiesApproved, setHistoriesApproved] = React.useState([])

  function getBirthDate(params) {
    var date = new Date(params.row.birthDate * 1000);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    let value = dd + '/' + mm + '/' + yyyy;
    return value;
  }
  
  function getSkills(params) {
    let skillsString = ""
    console.log(params.row.skills)
    for (let i = 0; i < params.row.skills.length; i++)
    {
      console.log(params.row.skills[i])
      skillsString += params.row.skills[i] + ", "
      if (i == (params.row.skills.length - 1))
      {
        skillsString += params.row.skills[i]
      }
    }
    console.log(skillsString)
  
    return skillsString;
  }
  
  const handleGetHistory = async (e, row, buttonName) => {
  
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Appointments.networks[networkId]
    const accounts = await web3.eth.getAccounts()
    
    if(networkData) {
        const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)

        if (buttonName == "Get History")
        {
          await appContract.methods.addRequestToShareMedicalRecords(row['_address']).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
          
          })
          
          const encryptionKey = await appContract.methods.getEncryptionPublicKey(accounts[0]).call()
          if (encryptionKey == ""){
            let encryptionPublicKey;
            try {
              var result = await ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [accounts[0]], // you must have access to the specified account
              });
              console.log(result);
              encryptionPublicKey = result;
  
              await appContract.methods.addEncryptionKey(encryptionPublicKey).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
                }).on('error', (e) =>{
                  window.alert('Error')
                  // this.setState({loading: false})
                
                })
            } catch (error) {
              if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                console.log("We can't encrypt anything without the key.");
              } else {
                console.error(error);
              }
            }
        }
        }
      else
      {
        const hashHistory = await appContract.methods.getFileHistoryFromPatient("0x0693C320A32202DE71aCf08fa5c2E4fC8F93410a").call()
        console.log(hashHistory['_hash'])
        const url = `https://ipfs.moralis.io:2053/ipfs/${hashHistory['_hash']}`;
        const response = await fetch(url);
        response.json().then((history) => {
          ethereum
        .request({
          method: 'eth_decrypt',
          params: [history, accounts[0]],
        })
        .then((decryptedMessage) =>
          console.log('The decrypted message is:', decryptedMessage)
        )
        .catch((error) => console.log(error.message));
        })
      }
    }
  }
  
  const renderDetailsButton = (params) => {
    let buttonName = "Get History";
    if (historiesApproved.includes(params.row["_address"])){
      buttonName = "See History"
    }
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: 16 }}
                onClick={(e) => {handleGetHistory(e, params.row, buttonName)}}
            >
                {buttonName}
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
      width: 120,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 100,
    },
    {
      field: 'city',
      headerName: 'City',
      width: 100,
    },
    {
      field: 'birthDate',
      headerName: 'Birth date',
      type: 'date',
      width: 100,
      valueGetter: getBirthDate,
    },
    {
      field: '_addressLocation',
      headerName: 'Location',
      width: 160,
      renderCell: renderCellExpand 
    },
    {
      field: 'CNP',
      headerName: 'CNP',
      type: "numeric",
      width: 150,
    },
    {
      field: '_address',
      headerName: 'Address',
      width: 160,
      renderCell: renderCellExpand 
    },
    {
      field: 'history',
      headerName: 'History',
      width: 150,
      renderCell: renderDetailsButton 
    },
  ];

  React.useEffect(() => {
    loadWeb3()
    getPatients()
    loadHistoryApproved()
  }, [])

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

  const loadHistoryApproved = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Appointments.networks[networkId]
    const accounts = await web3.eth.getAccounts()

    if(networkData) {
        const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)

        const historyList = await appContract.methods.getHistoryAvailableForDoctor(accounts[0]).call();
        setHistoriesApproved(historyList)
    }
  }

  const getPatients = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Appointments.networks[networkId]
    const patientsData = Patients.networks[networkId]

    let patientsList = []

    if(networkData) {
        const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)
        const patientsContract = new web3.eth.Contract(Patients.abi, patientsData.address)

        const accounts = await web3.eth.getAccounts()
        const patients = await appContract.methods.getPatientsOfADoctor(accounts[0]).call();
        
        console.log(patients)
        
        for (let i = 0; i < patients.length; i++)
        {
          const patient = await patientsContract.methods.getPatient(patients[i]).call();
          patientsList.push(patient)
        }
    }
    setPatients(patientsList)
  }

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={patients}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        getRowId={(row) => row.CNP}
      />
    </div>
  );
}