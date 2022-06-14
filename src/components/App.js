import DStorage from '../abis/DStorage.json'
import Hospitals from '../abis/Hospitals.json';
import Files from '../abis/Files.json'
import Patients from '../abis/Files.json'
import Registration from '../abis/Registration.json'

import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Login from './Login';
import Web3 from 'web3';
import './App.css';
import { Routes, Route, BrowserRouter } from  'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Register from './register/Register';

import DoctorDashboard from './doctor-view/doctor-dashboard/DoctorDashboard';
import DoctorPatientsView from './doctor-view/doctor-patientsView/PatientsDoctorView';
import Patient from './patient-view/patient-home/Patient';
import { ethers } from "ethers"
import Doctors from './admin-view/doctor/Doctors';
import DoctorForm from './register/DoctorForm/DoctorForm';
import PatientsComponent from './admin-view/patient/PatientComponent'
import HospitalsComponent from './admin-view/hospitals/Hospitals';
import BookAppointment from './patient-view/patient-home/BookAppointment';
import PatientsOfDoctorComponent from './doctor-view/patients/PatientComponent'
import Invitations from './patient-view/history-invitations/Invitations';

import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
var CryptoJS = require("crypto-js/core")
CryptoJS.AES = require("crypto-js/aes");
var crypto = require("crypto");

import { useMoralis } from "react-moralis";

function App(){

  const [account, setAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [filesCount, setFilesCount] = useState(0);
  const [buffer, setBuffer] = useState(null);
  
  const [hospitals, setHospitals] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [dstorageContract, setDstorageContract] = useState({})
  const [filesContract, setFilesContract] = useState({})
  const [hospitalsContract, setHospitalsContract] = useState({})
  const [patientsContract, setPatientsContract] = useState({})
  const [registrationContract, setRegsitrationContract] = useState({})

  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();
  const navigate = useNavigate();
  Moralis.onAccountChanged( async (account) => {
      // dispatch({
      // type: "info",
      // message: "You changed accounts",
      // title: "Account changed",
      // position: "topL"
      // })
      console.log("changed")
      logout();
      navigate('/login')
  });

  const [doctor, setDoctor] = useState({address: "12", age: 10, doctorName: "nume", specialization: "sp"});
  const age = doctor.age;
  const doctorName = doctor.doctorName;
  const specialization = doctor.specialization;
  const address = doctor.address;

  useEffect(() => {
    loadWeb3()
    loadAccount()
    //  addHospitals()
}, []);

  const loadAccount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  const loadWeb3 = async () => {
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

  const firebaseConfig = {
    apiKey: "AIzaSyDSkFohvPfcgc0UuP1mXEn342V_U0l6_Jg",
    authDomain: "decentralized-hsystem.firebaseapp.com",
    projectId: "decentralized-hsystem",
    storageBucket: "decentralized-hsystem.appspot.com",
    messagingSenderId: "422230127400",
    appId: "1:422230127400:web:48edf1a1ec9fe40a4e961d",
    measurementId: "G-K0P6PHY52Y"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);

  const countries = [
    {
        abbreviation: "at",
        country: "Austria"
    },
    {
        abbreviation: "be",
        country: "Belgium"
    },
    {
        abbreviation: "bg",
        country: "Bulgary"
    },
    {
        abbreviation: "ca",
        country: "Canada"
    },
    {
        abbreviation: "cz",
        country: "Czech Republic"
    },
    {
        abbreviation: "de",
        country: "Germany"
    },
    {
        abbreviation: "dk",
        country: "Denmark"
    },
    {
        abbreviation: "ee",
        country: "Estonia"
    },
    {
        abbreviation: "es",
        country: "Spain"
    },
    {
        abbreviation: "fi",
        country: "Finland"
    },
    {
        abbreviation: "fr",
        country: "France"
    },
    {
        abbreviation: "gb",
        country: "United Kingdom of Great Britain and Northern Ireland"
    },
    {
        abbreviation: "hr",
        country: "Croatia"
    },
    {
        abbreviation: "hu",
        country: "Hungary"
    },
    {
        abbreviation: "ie",
        country: "Ireland"
    },
    {
        abbreviation: "it",
        country: "Italy"
    },
    {
        abbreviation: "nl",
        country: "Netherlands"
    },
    {
        abbreviation: "no",
        country: "Norway"
    },
    {
        abbreviation: "nz",
        country: "New Zeeland"
    },
    {
        abbreviation: "pl",
        country: "Poland"
    },
    {
        abbreviation: "pt",
        country: "Portugal"
    },
    {
        abbreviation: "ro",
        country: "Romania"
    },
    {
        abbreviation: "se",
        country: "Sweden"
    },
    {
        abbreviation: "si",
        country: "Slovenia"
    },
    {
        abbreviation: "sk",
        country: "Slovakia"
    }
];
  const addHospitals = async () => {
    // for (let i = 0; i < countries.length; i++)
    // {
      
      // country.set("country", countries[i]['country'])

      fetch( './ro/hospitals.json' )
            .then( response => response.text() )
            .then( json => {
                const obj = JSON.parse(json)
                
                const hospitalsSet = new Set()
                for (let item in obj){
                  const hospital = new Moralis.Object("Hospitals");
                  hospital.set("name", obj[item]["name"])
                  hospital.set("city", obj[item]["city"])
                  hospital.set("country", "Romania")
                  hospital.set("zip", obj[item]["zip"])
                  hospital.set("LAT", obj[item]["LAT"])
                  hospital.set("LON", obj[item]["LON"])
                  if (hospitalsSet.has(obj[item]["name"]))
                  {
                    console.log("dupl")
                  }
                  else{
                    hospital.save().then(() => {} )
                      console.log(obj[item]["name"])
                      hospitalsSet.add(obj[item]["name"])
                  }        
                }
            })
  }

  // const loadBlockchainData = async () => {
  //   const web3 = window.web3
  //   const accounts = await web3.eth.getAccounts()

  //   // this.setState({ account: accounts[0] })
  //   setAccount(accounts[0])
  //   // Network ID
  //   const networkId = await web3.eth.net.getId()
  //   const networkData = DStorage.networks[networkId]
  //   const networkData1 = Hospitals.networks[networkId]
  //   console.log(account)
  //   if(networkData) {
  //     // Assign contract
  //     const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
  //     const hospitals = new web3.eth.Contract(Hospitals.abi, networkData1.address)
  //     setHospitals(hospitals)

  //     // const Doctor1 = await hospitals.methods.getDoctor("0x89c7Ac6fdd489C432a4ffDbE4a576083cD15B4FB").call();
  //     // console.log(Doctor1)
  //     // hospitals.methods.addHospital(1, "Spitalul de urgente", "Cluj-Napoca", "Romania").send({ from: accounts[0] }).on('transactionHash', (hash) => {
  //     //   //   this.setState({
  //     //   //    loading: false,
  //     //   //    type: null,
  //     //   //    name: null
  //     //   //  })
  //     //   setLoading(false)
  //     //    window.location.reload()
  //     //   }).on('error', (e) =>{
  //     //     window.alert('Error')
  //     //     // this.setState({loading: false})
  //     //     setLoading(false)
  //     //   })
  //     // const hospital1 = await hospitals.methods.getHospital(1).call();
  //     // console.log(hospital1)

  //     const doctors = await hospitals.methods.getDoctorsInAHospital(1).call();
  //     console.log(doctors)

  //     // hospitals.methods.addDoctor("0x681536517EEd5a1622485bf61119F27F477A871f", 46, "Doctor2", "skin", 1).send({ from: accounts[0] }).on('transactionHash', (hash) => {
  //     //   //   this.setState({
  //     //   //    loading: false,
  //     //   //    type: null,
  //     //   //    name: null
  //     //   //  })
  //     //   setLoading(false)
  //     //    window.location.reload()
  //     //   }).on('error', (e) =>{
  //     //     window.alert('Error')
  //     //     // this.setState({loading: false})
  //     //     setLoading(false)
  //     //   })
  //     // console.log(doctor.name)
      
  //     // this.setState({ dstorage })
  //     setDstorage(dstorage)

  //     // Get files amount
  //     const filesCount = await dstorage.methods.fileCount().call()
  //     // this.setState({ filesCount })

  //     //const members = await dstorage.methods.members(file.uploader).call()
  //     //this.setState({ members })
  //     // Load files&sort by the newest
  //     for (var i = filesCount; i >= 1; i--) {
  //       const file = await dstorage.methods.files(i).call()
  //       const members = await dstorage.methods.members(accounts[0]).call()
  //       //console.log(members)
  //       // if (members)
  //       // this.setState({
  //       //   files: [...this.state.files, file]
  //       // })
  //       setFiles([...files, file])
  //     }
  //   } else {
  //     window.alert('DStorage contract not deployed to detected network.')
  //   }
  // }

  // const captureFile = useCallback(() => {
  //   const file = event.target.files[0]
  //   const reader = new window.FileReader()

  //   reader.readAsArrayBuffer(file)
  //   reader.onloadend = () => {
  //     this.setState({
  //       buffer: Buffer(reader.result),
  //       type: file.type,
  //       name: file.name
  //     })
  //     console.log('buffer', this.state.buffer)
  // }, [todos]);

  // Get file from user
  const captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      // const web3 = window.web3
      // const accounts = await web3.eth.getAccounts()
      
      // let public_key;
      // var wordArray = CryptoJS.enc.Utf8.parse(Buffer(reader.result));
      // var base64 = CryptoJS.enc.Base64.stringify(wordArray);
      // var ecrytpted = CryptoJS.AES.encrypt(base64, String(public_key))
      // console.log('encrypted:', ecrytpted);

      // var encrypted = CryptoJS.AES.encrypt("Buffer(reader.result)", String(public_key));
      // // console.log(encrypted)
      // var decrypted = CryptoJS.AES.decrypt(encrypted.toString(), String(public_key));
      // console.log(decrypted.toString(CryptoJS.enc.Utf8));
      // })
      // .catch((error) => {
      //   if (error.code === 4001) {
      //     // EIP-1193 userRejectedRequest error
      //     console.log("We can't encrypt anything without the key.");
      //   } else {
      //     console.error(error);
      //   }
      // });
      

      setBuffer(Buffer(reader.result))
      setType(file.type)
      setName(file.name)
      console.log('buffer', buffer)
    }
  }

  const uploadFile = description => {
    console.log("Submitting file to IPFS...")

    // Add file to the IPFS
    ipfs.add(buffer, (error, result) => {
      console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return
      }

      // this.setState({ loading: true })
      setLoading(true)
      // Assign value for the file without extension
      if(type === ''){
        // this.setState({type: 'none'})
        setType('none')
      }
      dstorage.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: account }).on('transactionHash', (hash) => {
      //   this.setState({
      //    loading: false,
      //    type: null,
      //    name: null
      //  })
      setLoading(false)
      setType(null)
      setName(null)
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        // this.setState({loading: false})
        setLoading(false)
      })
    })
  }

  
    return (
      <div>
        
          <Routes>
            <Route path="/files" exact element={<><Navbar account={account}/>
                                             <Main files={files}
                                                   captureFile={captureFile}
                                                   uploadFile={uploadFile}/></>}/>
            <Route path="/login" exact element={<Login account={account} registration={registrationContract}/>} />
            <Route path="/register" exact element={<Register account={account}/>} />
            <Route path="/doctor-dashboard" exact element={<DoctorDashboard account={account}/>} />
            <Route path="/patients" exact element={<DoctorPatientsView account={account}/>} />
            <Route path="/home" exact element={<Patient account={account}/>} />
            <Route path="/admin/doctors" exact element={<Doctors account={account}/>} />
            <Route path="/admin/patients" exact element={<PatientsComponent account={account}/>} />
            <Route path="/admin/hospitals" exact element={<HospitalsComponent account={account}/>} />
            <Route path="/book-appointment" element={<BookAppointment account={account}/>} />
            <Route path="/doctor/patients" element={<PatientsOfDoctorComponent account={account}/>} />
            <Route path="/patient/invitations" element={<Invitations account={account}/>} />
          </Routes>
        
        {/* { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        } */}
      </div>
    );
  
}

export default App;