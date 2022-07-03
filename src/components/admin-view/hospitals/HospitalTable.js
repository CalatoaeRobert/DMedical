import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Hospitals from '../../../abis/Hospitals.json';
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import { useMoralis } from "react-moralis";
import { useMoralisQuery } from "react-moralis";

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
    field: 'name',
    headerName: 'Name',
    width: 150,
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 120,
  },
  {
    field: 'city',
    headerName: 'City',
    width: 100,
  },
  {
    field: 'zip',
    headerName: 'ZIP',
    type: "numeric",
    width: 100,
  },
  {
    field: 'LON',
    headerName: 'LON',
    type: "numeric",
    width: 150,
  },
  {
    field: 'LAT',
    headerName: 'LAT',
    type: "numeric",
    width: 150,
  }
];

export default function DataGridDemo() {
  const [hospitals, setHospitals] = React.useState([])
  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();

  const serverUrl = "https://y6jxsxjnbbo1.usemoralis.com:2053/server"
  const appId =  "L1N8KnhXQYCKoJyeRd95qZf1will3QM0DE8YzlJS"
  Moralis.start({ serverUrl, appId});

  React.useEffect(() => {
    loadWeb3()
    getHospitals()
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

    const { fetch } = useMoralisQuery(
        "Hospitals",
        (query) => query.limit(1000),
        [],
        { autoFetch: false }
      );

  const getHospitals = async () => {
    // const web3 = window.web3
    // const networkId = await web3.eth.net.getId()
    // const networkData = Hospitals.networks[networkId]

    // let doctorsList = []

    // if(networkData) {
    //     const hospitalC = new web3.eth.Contract(Hospitals.abi, networkData.address)
    //     const accounts = await web3.eth.getAccounts()
    //     const doctors = await hospitalC.methods.getDoctors().call();
        
    //     for (let i = 0; i < doctors.length; i++)
    //     {
    //       const doctor = await hospitalC.methods.getDoctor(doctors[i]).call();
    //       doctorsList.push(doctor)
    //     }
    // }
    // setDoctors(doctorsList)
    // const results = await Moralis.Cloud.run("getAllHospitals");
    // console.log(results)
    // let countriesResults = [];
    // for (let i = 0; i < results.length; i++) {
    //     const country = results[i];
    //     console.log(country)
    //     // countriesResults.push({value: country['objectId'], label: country['objectId']})
    // }
    const results = await fetch();
    let hospitalList = [];
    for (let i = 0; i < results.length; i++) {
        const object = results[i];
        hospitalList.push({name: object.get("name"), country: object.get("country"), city: object.get("city"),
        zip: object.get("zip"), LON: object.get("LON"), LAT: object.get("LAT")})
        // console.log(object.get("city"))
    }
    setHospitals(hospitalList)
    // setCountries(countriesResults)
    // console.log(countries)
  }

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={hospitals}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        getRowId={(row) => row.name}
      />
    </div>
  );
}