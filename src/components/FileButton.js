import { useNavigate } from "react-router-dom";
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import { useMoralis} from "react-moralis";
import { useNotification } from 'web3uikit';
import Web3 from 'web3';
import Registration from '../abis/Registration.json';

function HomeButton(props) {  
    const navigate = useNavigate();

    const { authenticate, isAuthenticated, user, Moralis } = useMoralis();

    const handleClick = async () => {
      let user = Moralis.User.current();
      console.log(isAuthenticated)

      if (!isAuthenticated) {

        await authenticate()
          .then(function (user) {
            console.log(user.get("ethAddress"));
            console.log(props.role)
            if (props.isRegistered){
              if (props.role == "PATIENT")
              {
                //notify()
                navigate('/home')
              }
              else if (props.role == "DOCTOR")
              {
                //notify()
                navigate('/doctor/patients')
              }
              else if (props.role == "ADMIN")
              {
                //notify()
                navigate('/admin/doctors')
              }
            }
            else{
              navigate('/register')
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      else {
        if (props.isRegistered){
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
        }
        else{
          navigate('/register')
        }
      }
    }
   return (
    <Button variant="contained" onClick={handleClick}  sx={{textTransform: 'none', color: "rgb(227,241,236)", backgroundColor: "rgb(6, 96, 58)"}}>
        Login with MetaMask
    </Button>
  );
  }

export default HomeButton