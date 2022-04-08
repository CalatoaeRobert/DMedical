import { useNavigate } from "react-router-dom";
import React, { Component } from 'react';

function HomeButton(props) {  
    const navigate = useNavigate();

    function handleClick() {
      if (props.isRegistered){
        navigate('/files');
      }
      else{
        navigate('/register')
      }
   }

   return (
    <button type="button" onClick={handleClick}>
        Connect Wallet
    </button>
  );
  }

export default HomeButton