import React, { Component } from 'react';
import Web3 from 'web3';
import Registration from '../abis/Registration.json';
import Appointments from '../abis/Appointments.json'
import { useState, useEffect } from 'react';
import HomeButton from './FileButton';
import MetamaskLogo from './MetamaskLogo';
import { useMoralis } from "react-moralis";
import { useNotification } from 'web3uikit';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

function Login(props){
  const navigate = useNavigate();

  const dispatch = useNotification();

  const [registration, setRegistration] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("");
  const { authenticate, isAuthenticated, user, Moralis, logout} = useMoralis();

  const handleNotificationLogin = () => {
    dispatch({
      type: "success",
      message: "You successfully authenticated",
      title: "Authentication with success",
      position: "topL"
    })
  }

  useEffect(() => {
      loadWeb3()
      loadAccount()
      // listAllFiles()
      // checkAccountChange()
      loadRegistration()
      checkWorkingInv()
  }, [props.account, isAuthenticated]);

    const loadWeb3 = async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    
    const loadAccount = async () => {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])
      Moralis.User.currentAsync().then(function(user) {
        if (user != null)
        {
          var loggedInAcc = user.get('ethAddress');
          if (props.account.toLowerCase() != loggedInAcc.toLowerCase())
          {
            console.log(props.account)
            console.log(loggedInAcc)
            logout();
          }
        }
     });
    }

    const loadRegistration = async () => {
      const web3 = window.web3
      // Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = Registration.networks[networkId]
      
      if(networkData) {
        // Assign contract
        const accounts = await web3.eth.getAccounts()
        const registration = new web3.eth.Contract(Registration.abi, networkData.address)  
       
        if (props.account != ''){
          // var isPatient = await registration.methods.isPatient(props.account).call()
          // console.log(registration.methods)
          // if (isPatient)
          // {
          //   setRole("PATIENT");
          // }
          // var isDoctor = await registration.methods.isDoctor(props.account).call();
          // if (isDoctor)
          // {
          //   setRole("DOCTOR");
          // }
          // var isAdmin = await registration.methods.isAdmin(props.account).call();
          var role = await registration.methods.getRole(props.account).call();
          setRole(role)
          console.log(role)
          // if (isAdmin)
          // {
          //   setRole("ADMIN");
          // }
          // console.log(props.account)
          // var pat = await registration.methods.getUserCount().call()
          // console.log(pat)
        }
      }
    }

    const checkWorkingInv = async () => {
      const web3 = window.web3
      // Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = Appointments.networks[networkId]
      if(networkData) {
        // Assign contract
        const accounts = await web3.eth.getAccounts()
        const app = new web3.eth.Contract(Appointments.abi, networkData.address)

        // await app.methods.addRequestToShareMedicalRecords("0x52854d37B5084CB76600a726409d64CCc0A2196B").send({ from: accounts[0] }).on('transactionHash', (hash) => {
          
        //   }).on('error', (e) =>{
        //     window.alert('Error')
        //     // this.setState({loading: false})
          
        //   })

        // await app.methods.acceptRequestFromDoctor("0x0693C320A32202DE71aCf08fa5c2E4fC8F93410a", 0).send({ from: accounts[0] }).on('transactionHash', (hash) => {
          
        //   }).on('error', (e) =>{
        //     window.alert('Error')
        //     // this.setState({loading: false})
          
        //   })
        const requests = await app.methods.getRequestsOfAPatient("0x52854d37B5084CB76600a726409d64CCc0A2196B").call()
        console.log(requests)
      }

    }

    const handleClick = async () => {
      let user = Moralis.User.current();
      console.log(isAuthenticated)

      if (!isAuthenticated) {

        await authenticate()
          .then(function (user) {
            console.log(user.get("ethAddress"));
            console.log(role)
            if (role == "PATIENT")
            {
              //notify()
              navigate('/home')
            }
            else if (role == "DOCTOR")
            {
              //notify()
              navigate('/doctor/patients')
            }
            else if (role == "ADMIN")
            {
              //notify()
              navigate('/admin/doctors')
            }
            else {
              navigate('/register')
            }
            
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      else {
        if (props.role == "PATIENT")
        {
          notify()
          navigate('/home')
        }
        else if (props.role == "DOCTOR")
        {
          notify()
          navigate('/doctor/patients')
        }
        else if (props.role == "ADMIN")
        {
          notify()
          navigate('/admin/doctors')
        }
        else{
          navigate('/register')
        }
      }
    }

      return (
        <body style={{backgroundColor: "rgb(6, 96, 58)", overflow: "hidden"}}>
          <div style={{width: "60%", float: "left", padding: "20px", height:'100vh', backgroundColor: "rgb(6, 96, 58)"}}>
            <div style={{color: "rgb(227,241,236)", marginLeft: "20%", marginTop: "24%", fontSize: "50px", fontFamily: "Copperplate"}}>
            PERSONALIZED
            HEALTHCARE
            SYSTEM
            </div>
          </div>
          <div style={{width: "10%", float: "left", marginLeft: "55px", transform: "skewX(-7deg)", height: '100vh', backgroundColor: "rgb(227,241,236)", overflow: "hidden"}}>
            
          </div>

          <div style={{marginLeft: "69%", width: "31%", float: "left", display: 'flex', flexDirection:"column",justifyContent:'center', alignItems:'center', height: '100vh', backgroundColor: "rgb(227,241,236)", position: "absolute"}}>
              <div style={{ transform: ""}}>
                <MetamaskLogo></MetamaskLogo>
                <Button variant="contained" onClick={handleClick}  sx={{textTransform: 'none', color: "rgb(227,241,236)", backgroundColor: "rgb(6, 96, 58)"}}>
                    Login with MetaMask
                </Button>
              </div>
          </div>
        </body>
      );
    
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //       account: '',
    //       registration: null,
    //       isRegistered: false
    //     }
    //   }
}

export default Login;