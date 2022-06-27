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
// import DoctorPatientsView from './doctor-view/doctor-patientsView/PatientsDoctorView';
import Patient from './patient-view/patient-home/Patient';
import { ethers } from "ethers"
import Doctors from './admin-view/doctor/Doctors';
import DoctorForm from './register/DoctorForm/DoctorForm';
import PatientsComponent from './admin-view/patient/PatientComponent'
import HospitalsComponent from './admin-view/hospitals/Hospitals';
import BookAppointment from './patient-view/patient-home/BookAppointment';
import PatientsOfDoctorComponent from './doctor-view/patients/PatientComponent'
import Invitations from './patient-view/history-invitations/Invitations';
import HistoryPatient from './doctor-view/history-view/HistoryPatient';
import History from './patient-view/history/History';
import AppointmentsHistory from './patient-view/appointments/AppointmentsHistory';
import DoctorAppointments from './doctor-view/appointments/DoctorAppointments';
import MedicalResearchers from './admin-view/medical-researchers/MedicalReseachers';
import PatientsHistorySell from './researcher-view/patient-view/PatientsHistorySell'
import PatientResearchers from './patient-view/researchers/PatientResearchers'
import PatientsOfResearchersComponent from './researcher-view/patient-history/PatientsOfResearchers';
import HistoryResearcher from './researcher-view/history-view/HistoryResearcher';

import Private from './Private'

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
  
  const [hospitals, setHospitals] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false)
  const [isPatient, setIsPatient] = useState(false)
  const [isDoctor, setIsDoctor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isResearcher, setIsResearcher] = useState(false)

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
    loadIsRegistered()
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
                  if (!hospitalsSet.has(obj[item]["name"]))
                  {
                    hospital.save().then(() => {} )
                    hospitalsSet.add(obj[item]["name"])
                  }      
                }
            })
  }

  const loadIsRegistered = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()

    const networkId = await web3.eth.net.getId()
    const networkData = Registration.networks[networkId]
    if(networkData) {
      const registrationContract = new web3.eth.Contract(Registration.abi, networkData.address)

      const isRegistered = await registrationContract.methods.userExists(accounts[0]).call()
      setIsRegistered(true)

      const role = await registrationContract.methods.getRole(accounts[0]).call()
      if (role == "PATIENT"){
        setIsPatient(true)
        setIsDoctor(false)
        setIsAdmin(false)
        setIsResearcher(false)
      }
      else if(role == "DOCTOR"){
        setIsDoctor(true)
        setIsAdmin(false)
        setIsResearcher(false)
        setIsPatient(false)
      }
      else if(role == "ADMIN"){
        setIsAdmin(true)
        setIsResearcher(false)
        setIsPatient(false)
        setIsDoctor(false)
      }
      else if(role == "RESEARCHER_ROLE"){
        setIsResearcher(true)
        setIsPatient(false)
        setIsDoctor(false)
        setIsAdmin(false)
      }
    }
  }

  
    return (
      <div>
        
          <Routes>
            <Route path="/login" exact element={<Login account={account}/>} />
            <Route path="/register" exact element={<Register account={account}/>} />
            <Route path="/doctor-dashboard" exact element={
                  <Private auth={isRegistered}>
                  <DoctorDashboard account={account}/>
                </Private>
            } />
            <Route path="/home" exact element={<Patient account={account}/>} />
            <Route path="/admin/doctors" exact element={<Doctors account={account}/>} />
            <Route path="/admin/patients" exact element={<PatientsComponent account={account}/>} />
            <Route path="/admin/hospitals" exact element={<HospitalsComponent account={account}/>} />
            <Route path="/book-appointment" element={<BookAppointment account={account}/>} />
            <Route path="/doctor/patients" element={<PatientsOfDoctorComponent account={account}/>} />
            <Route path="/patient/invitations" element={<Invitations account={account}/>} />
            <Route path='/doctor/patient-history' element={<HistoryPatient account={account}/>} />
            <Route path='/my-history' element={<History account={account}/>} />
            <Route path='/appointment-history' element={<AppointmentsHistory account={account}/>} />
            <Route path='/doctor/appointment-history' element={<DoctorAppointments account={account}/>} />
            <Route path='/admin/medical-reseachers' element={<MedicalResearchers account={account}/>} />
            <Route path='/researcher/buy-history' element={<PatientsHistorySell account={account}/>} />
            <Route path='/researchers' element={<PatientResearchers account={account}/>} />
            <Route path='/researcher/patients' element={<PatientsOfResearchersComponent account={account}/>} />
            <Route path='/researcher/patient-history' element={<HistoryResearcher account={account}/>} />
          </Routes>
      </div>
    );
  
}

export default App;