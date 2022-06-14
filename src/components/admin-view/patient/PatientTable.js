import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Patients from '../../../abis/Patients.json';
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';

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
  }
];

export default function DataGridDemo() {
  const [patients, setPatients] = React.useState([])

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
    const networkData = Patients.networks[networkId]

    let patientsList = []

    if(networkData) {
        const patientsContract = new web3.eth.Contract(Patients.abi, networkData.address)
        const accounts = await web3.eth.getAccounts()
        const patients = await patientsContract.methods.getPatientsAccount().call();
        
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