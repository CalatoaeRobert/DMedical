import { Navigate } from 'react-router-dom';
import React, { Component } from 'react';

export default function Private({auth, children}){
    console.log(auth)
    if (!auth) {
        return <Navigate to="/login" />;
    }
    
    return children;
    // return props.auth ? <Component /> : <Navigate to="/login" />
}