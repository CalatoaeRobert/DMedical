import React, { Component } from 'react';
import Web3 from 'web3';
import Registration from '../abis/Registration.json';
import { useState, useEffect } from 'react';
import HomeButton from './FileButton';

function Login(props){

  const [registration, setRegistration] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
      loadWeb3()
      //loadAccount()
      loadRegistration()
  }, [props.account]);

    
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
      // this.setState({ account: accounts[0] })
      // setAccount(accounts[0])
      // console.log(account)
    }

    const loadRegistration = async () => {
      const web3 = window.web3
      // Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = Registration.networks[networkId]
      
      if(networkData) {
        // Assign contract
        const registration = new web3.eth.Contract(Registration.abi, networkData.address)
        // this.setState({ registration })
        setRegistration(registration)

       
        if (props.account != ''){
          var isRegistered = await registration.methods.userExists(props.account).call();
          // // this.setState({ isRegistered })
          setIsRegistered(isRegistered)
          console.log(isRegistered)
        }
      }
    }
   
      return (
          <div>
              <h1>Login</h1>
              <HomeButton isRegistered={isRegistered}/>
          </div>
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