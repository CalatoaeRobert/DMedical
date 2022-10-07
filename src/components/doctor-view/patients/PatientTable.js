import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Appointments from '../../../abis/Appointments.json';
import Patients from '../../../abis/Patients.json';
import Hospitals from '../../../abis/Hospitals.json'
import Files from '../../../abis/Files.json'
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

export default function DataGridDemo() {
  const [patients, setPatients] = React.useState([])
  const [historiesApproved, setHistoriesApproved] = React.useState([])

  const navigate = useNavigate();

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
    const hospitalData = Hospitals.networks[networkId]
    const filesData = Files.networks[networkId]

    const accounts = await web3.eth.getAccounts()
    
    if(networkData) {
        const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)
        const hospitalContract = new web3.eth.Contract(Hospitals.abi, hospitalData.address)
        const filesContract = new web3.eth.Contract(Files.abi, filesData.address)
        if (buttonName == "Get History")
        {
          await filesContract.methods.addRequestToShareMedicalRecords(row['_address']).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
          }).on('error', (e) =>{
            window.alert('Error')
            // this.setState({loading: false})
          
          })
          
          const encryptionKey = await hospitalContract.methods.getEncryptionPublicKey(accounts[0]).call()
          console.log(encryptionKey)
          if (encryptionKey == ""){
            let encryptionPublicKey;
            try {
              var result = await window.ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [accounts[0]], // you must have access to the specified account
              });
              console.log(result);
              encryptionPublicKey = result;
  
              await hospitalContract.methods.addEncryptionKey(encryptionPublicKey).send({ from: accounts[0] }).on('transactionHash', (hash) => { 
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
        navigate({
          pathname: '/doctor/patient-history',
            search: `?patient=${row['_address']}`,
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
                // onClick={() => navigate({
                //   pathname: '/doctor/patient-history',
                //     search: `?patient=${params.row['_address']}`,
                //   })}
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
    const networkData = Files.networks[networkId]
    const accounts = await web3.eth.getAccounts()

    if(networkData) {
        const filesContract = new web3.eth.Contract(Files.abi, networkData.address)

        const historyList = await filesContract.methods.getHistoryAvailableForDoctor(accounts[0]).call();
        console.log(historyList)
        setHistoriesApproved(historyList)
    }
  }

  const getPatients = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Appointments.networks[networkId]
    const patientsData = Patients.networks[networkId]

    let patientsList = []
    let cnpList = []

    if(networkData) {
        const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)
        const patientsContract = new web3.eth.Contract(Patients.abi, patientsData.address)

        const accounts = await web3.eth.getAccounts()
        const patients = await appContract.methods.getPatientsOfADoctor(accounts[0]).call();
        
        console.log(patients)
        
        for (let i = 0; i < patients.length; i++)
        {
          const patient = await patientsContract.methods.getPatient(patients[i]).call();
          if (!cnpList.includes(patient['CNP'])){
            console.log(patient)
            patientsList.push(patient)
            cnpList.push(patient['CNP'])
          }
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