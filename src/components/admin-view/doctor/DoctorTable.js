import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Hospitals from '../../../abis/Hospitals.json';
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Link from '@mui/material/Link';

function getBirthDate(params) {
  var date = new Date(params.row.birthDate * 1000);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); 
  var yyyy = date.getFullYear();
  let value = dd + '/' + mm + '/' + yyyy;
  return value;
}

function getProfilePic(params) {
  var link = "https://ipfs.moralis.io:2053/ipfs/" + params.row._profileHash;
  return link;
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
    field: 'birthDate',
    headerName: 'Birth date',
    type: 'date',
    width: 100,
    valueGetter: getBirthDate,
  },
  {
    field: 'gender',
    headerName: 'Gender',
    width: 100,
  },
  {
    field: 'cnp',
    headerName: 'CNP',
    type: "numeric",
    width: 150,
  },
  {
    field: 'specialization',
    headerName: 'Specialization',
    width: 150,
    editable: true
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
    field: 'hospital',
    headerName: 'Hospital',
    width: 160,
    renderCell: renderCellExpand,
  },
  {
    field: 'skills',
    headerName: 'Skills',
    width: 160,
    renderCell: renderCellExpand,
    valueGetter: getSkills
  },
  {
    field: '_profileHash',
    headerName: 'Profile Picture',
    width: 160,
    
    renderCell: (params) => (
      <Link to={`https://ipfs.moralis.io:2053/ipfs/${params._profileHash}`}>{params.row._profileHash}</Link>
    )
  },
  {
    field: 'walletAddress',
    headerName: 'Wallet Address',
    width: 160,
    renderCell: renderCellExpand 
  },
];

export default function DataGridDemo() {
  const [doctors, setDoctors] = React.useState([])


  React.useEffect(() => {
    loadWeb3()
    getDoctors()
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
    setDoctors(doctorsList)
  }

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={doctors}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        getRowId={(row) => row.cnp}
      />
    </div>
  );
}