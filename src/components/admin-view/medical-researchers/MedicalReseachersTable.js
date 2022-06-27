import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Hospitals from '../../../abis/Hospitals.json';
// import MedicalReseachers from '../../../abis/MedicalReseachers.json';
import MedicalResearchers from '../../../abis/MedicalResearchers.json'
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Link from '@mui/material/Link';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 250,
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 200,
  },
  {
    field: 'city',
    headerName: 'City',
    width: 150,
  },
  {
    field: 'nrOfPatients',
    headerName: 'Number of patients',
    width: 150,
  },
  {
    field: '_address',
    headerName: 'Wallet Address',
    width: 200,
    renderCell: renderCellExpand 
  },
];

export default function DataGridDemo() {
  const [medicalReseachers, setMedicalReseachers] = React.useState([])


  React.useEffect(() => {
    loadWeb3()
    getMedicalReseachers()
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


  const getMedicalReseachers = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = MedicalResearchers.networks[networkId]

    let reseachersList = []

    if(networkData) {
        const reseachersC = new web3.eth.Contract(MedicalResearchers.abi, networkData.address)
        const accounts = await web3.eth.getAccounts()
        const reseacherss = await reseachersC.methods.getReseachers().call();
        
        for (let i = 0; i < reseacherss.length; i++)
        {
          const reseacher = await reseachersC.methods.getResearcher(reseacherss[i]).call();
          reseachersList.push(reseacher)
        }
    }
    console.log(reseachersList)
    setMedicalReseachers(reseachersList)
  }

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={medicalReseachers}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        getRowId={(row) => row.name}
      />
    </div>
  );
}