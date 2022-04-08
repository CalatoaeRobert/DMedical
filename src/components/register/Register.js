import React from "react"
import './Register.css';
import { useState, useEffect, useCallback } from 'react';
import PatientForm from "./PatientForm/PatientForm";
import DoctorForm from "./DoctorForm/DoctorForm";
import ResearcherForm from "./ResearcherForm/ResearcherForm";

function Register(props){
    const [checked, setChecked] = useState("");

    return (
        <div>
            <h1>Register</h1>
            <div>
                <form>
                    <div className="cc-selector">
                        <input id="patient" type="radio" name="user" value="patient"
                        onChange={(e) => {
                            setChecked(e.target.value)
                            console.log("patient")
                        }}/>
                        <label className="drinkcard-cc patient" htmlFor="patient"></label>
                        <input id="doctor" type="radio" name="user" value="doctor" 
                        onChange={(e) => {
                            setChecked(e.target.value)
                            console.log("doctor")
                        }}/>
                        <label className="drinkcard-cc doctor"htmlFor="doctor"></label>
                        <input id="researcher" type="radio" name="user" value="researcher" 
                        onChange={(e) => {
                            setChecked(e.target.value)
                            console.log("researcher")
                        }}/>
                        <label className="drinkcard-cc researcher"htmlFor="researcher"
                        ></label>
                    </div>
                </form>
            </div>
            {checked === "patient" && <PatientForm />}
            {checked === "doctor" && <DoctorForm />}
            {checked === "researcher" && <ResearcherForm />}
    </div>
    );
}

export default Register