import { Navigate } from 'react-router-dom';
import React, { Component } from 'react';

export default function Private({isCorrectRole, children}){
    var isTrueSet = localStorage.getItem(isCorrectRole) === 'true'
    // var isTrueSet = (isCorrectRole === 'true');
    console.log(isTrueSet)
    if (!isTrueSet) {
        console.log("saas")
        return <Navigate to="/login" />;
    }
    
    return children;
    // return props.auth ? <Component /> : <Navigate to="/login" />
}