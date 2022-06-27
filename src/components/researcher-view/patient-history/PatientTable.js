import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Appointments from '../../../abis/Appointments.json';
import Patients from '../../../abis/Patients.json';
import MedicalResearchers from '../../../abis/MedicalResearchers.json'
import Files from '../../../abis/Files.json'
import Web3 from 'web3';
import renderCellExpand from '../../admin-view/GridCellExpand';
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
  
  const renderDetailsButton = (params) => {
    let buttonName = "See History";
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: 16 }}
                onClick={(e) => {handleSeeHistory(e, params.row)}}
                onClick={() => navigate({
                  pathname: '/researcher/patient-history',
                    search: `?patient=${params.row['_address']}`,
                  })}
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

  const getPatients = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = MedicalResearchers.networks[networkId]
    const patientsData = Patients.networks[networkId]

    let patientsList = []

    if(networkData) {
        const researcherContract = new web3.eth.Contract(MedicalResearchers.abi, networkData.address)
        const patientsContract = new web3.eth.Contract(Patients.abi, patientsData.address)

        const accounts = await web3.eth.getAccounts()
        const historyAvailable = await researcherContract.methods.getHistoryAvailableForResearcher(accounts[0]).call();
        
        console.log(historyAvailable)
        
        for (let i = 0; i < historyAvailable.length; i++)
        {
          const patient = await patientsContract.methods.getPatient(historyAvailable[i]).call();
          console.log(patient)
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