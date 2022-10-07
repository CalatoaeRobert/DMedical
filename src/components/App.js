import DStorage from '../abis/DStorage.json'
import Hospitals from '../abis/Hospitals.json';
import Files from '../abis/Files.json'
import Patients from '../abis/Files.json'
import Registration from '../abis/Registration.json'

import React, { Component } from 'react';
// import Navbar from './Navbar'
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
import InvitationsComponent from './doctor-view/invitations/InvitationsComponent';
import CalendarComponent from './patient-view/calendar/CalendarComponent'

import Private from './Private'

import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faUser, faNotesMedical, faUserDoctor, faHandshakeAngle, faCalendarCheck, 
  faFlaskVial, faHospitalUser, faEnvelope, faHospital, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'

import { useMoralis } from "react-moralis";

library.add(fas, faUser)
library.add(fas, faNotesMedical)
library.add(fas, faUserDoctor)
library.add(fas, faHandshakeAngle)
library.add(fas, faCalendarCheck)
library.add(fas, faFlaskVial)
library.add(fas, faHospitalUser)
library.add(fas, faEnvelope)
library.add(fas, faHospital)
library.add(fas, faCalendarDays)

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
var CryptoJS = require("crypto-js/core")
CryptoJS.AES = require("crypto-js/aes");
var crypto = require("crypto");


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
  

  const [doctor, setDoctor] = useState({address: "12", age: 10, doctorName: "nume", specialization: "sp"});
  const age = doctor.age;
  const doctorName = doctor.doctorName;
  const specialization = doctor.specialization;
  const address = doctor.address;

  useEffect(() => {
    loadWeb3()
    loadAccount()
    //loadIsRegistered()
    //  addHospitals()
}, []);

  useEffect(() => {
    loadIsRegistered()
  }, [account]);

  const loadAccount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    if (accounts.length > 0){
      setAccount(accounts[0])
    }
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
    if (accounts.length > 0){
      if(networkData) {
        const registrationContract = new web3.eth.Contract(Registration.abi, networkData.address)
  
        const isRegistered = await registrationContract.methods.userExists(accounts[0]).call()
        setIsRegistered(isRegistered)
        
        const role = await registrationContract.methods.getRole(accounts[0]).call()
        console.log(role)
        if (role == "PATIENT"){
          localStorage.setItem('isPatient', true);
          localStorage.setItem('isDoctor', false);
          localStorage.setItem('isAdmin', false);
          localStorage.setItem('isResearcher', false);
          // setIsDoctor(false)
          // setIsAdmin(false)
          // setIsResearcher(false)
        }
        else if(role == "DOCTOR"){
          localStorage.setItem('isPatient', false);
          localStorage.setItem('isDoctor', true);
          localStorage.setItem('isAdmin', false);
          localStorage.setItem('isResearcher', false);
          // setIsDoctor(true)
          // setIsAdmin(false)
          // setIsResearcher(false)
          // setIsPatient(false)
        }
        else if(role == "ADMIN"){
          // setIsAdmin(true)
          // setIsResearcher(false)
          // setIsPatient(false)
          // setIsDoctor(false)
          localStorage.setItem('isPatient', false);
          localStorage.setItem('isDoctor', false);
          localStorage.setItem('isAdmin', true);
          localStorage.setItem('isResearcher', false);
        }
        else if(role == "RESEARCHER"){
          // setIsResearcher(true)
          // setIsPatient(false)
          // setIsDoctor(false)
          // setIsAdmin(false)
          localStorage.setItem('isPatient', false);
          localStorage.setItem('isDoctor', false);
          localStorage.setItem('isAdmin', false);
          localStorage.setItem('isResearcher', true);
        }
        
      }
    }
  }

  
    return (
      <div>
        
          <Routes>
            <Route path="/login" exact element={<Login account={account}/>} />
            <Route path="/register" exact element={<Register account={account}/>} />
            <Route path="/doctor-dashboard" exact element={
                  <Private isCorrectRole={'isDoctor'}>
                  <DoctorDashboard account={account}/>
                </Private>
            } />
            <Route path="/home" exact element={
                  <Private isCorrectRole={'isPatient'}>
                  <Patient account={account}/>
                </Private>
            } />
            <Route path="/admin/doctors" exact element={
                  <Private isCorrectRole={'isAdmin'}>
                  <Doctors account={account}/>
                </Private>
            } />
            <Route path="/admin/patients" exact element={
                  <Private isCorrectRole={'isAdmin'}>
                  <PatientsComponent account={account}/>
                </Private>
            } />
            <Route path="/admin/hospitals" exact element={
                  <Private isCorrectRole={'isAdmin'}>
                  <HospitalsComponent account={account}/>
                </Private>
            } />
            <Route path="/book-appointment" element={
                  <Private isCorrectRole={'isPatient'}>
                  <BookAppointment account={account}/>
                </Private>
            } />
            <Route path="/doctor/patients" element={
                  <Private isCorrectRole={'isDoctor'}>
                  <PatientsOfDoctorComponent account={account}/>
                </Private>
            } />
            <Route path="/patient/invitations" element={
                  <Private isCorrectRole={'isPatient'}>
                  <Invitations account={account}/>
                </Private>
            } />
            <Route path='/doctor/patient-history' element={
                  <Private isCorrectRole={'isDoctor'}>
                  <HistoryPatient account={account}/>
                </Private>
            } />
            <Route path='/my-history' element={
                  <Private isCorrectRole={'isPatient'}>
                  <History account={account}/>
                </Private>
            } />
            <Route path='/appointment-history' element={
                  <Private isCorrectRole={'isPatient'}>
                  <AppointmentsHistory account={account}/>
                </Private>
            } />
            <Route path='/doctor/appointment-history' element={
                  <Private isCorrectRole={'isDoctor'}>
                  <DoctorAppointments account={account}/>
                </Private>
            } />
            <Route path='/admin/medical-reseachers' element={
                  <Private isCorrectRole={'isAdmin'}>
                  <MedicalResearchers account={account}/>
                </Private>
            } />
            <Route path='/researcher/get-history' element={
                  <Private isCorrectRole={'isResearcher'}>
                  <PatientsHistorySell account={account}/>
                </Private>
            } />
            <Route path='/researchers' element={
                  <Private isCorrectRole={'isPatient'}>
                  <PatientResearchers account={account}/>
                </Private>
            } />
            <Route path='/researcher/patients' element={
                  <Private isCorrectRole={'isResearcher'}>
                  <PatientsOfResearchersComponent account={account}/>
                </Private>
            } />
            <Route path='/researcher/patient-history' element={
                  <Private isCorrectRole={'isResearcher'}>
                  <HistoryResearcher account={account}/>
                </Private>
            } />
            <Route path='/doctor/calendar' element={
                  <Private isCorrectRole={'isDoctor'}>
                  <InvitationsComponent account={account}/>
                </Private>
            } />
            <Route path='/calendar' element={
                  <Private isCorrectRole={'isPatient'}>
                  <CalendarComponent account={account}/>
                </Private>
            } />
          </Routes>
      </div>
    );
  
}

export default App;