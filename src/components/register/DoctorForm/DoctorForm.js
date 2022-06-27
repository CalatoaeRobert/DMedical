import React from "react"
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as Papa from 'papaparse';
import { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Hospitals from 'C:/Licenta/Licenta/src/abis/Hospitals.json'
import Web3 from 'web3';

function DoctorForm(props){

    var countries = [
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

    // var hospitals = []

    const [name, setName] = React.useState("");
    const [age, setAge] = React.useState(0);
    const [specialization, setSpecialization] = React.useState("");
    const [country, setCountry] = React.useState(countries[0].abbreviation);
    const [city, setCity] = React.useState("");
    const [cities, setCities] = React.useState([]);
    const [hospital, setHospital] = React.useState("");
    const [hospitals, setHospitals] = React.useState([]);

    useEffect(() => {
        setCities([])
        getCitiesFromJSON()
    }, [country]);

    useEffect(() => {
        setHospitals([])
        getHospitalsFromJSON()
        console.log(hospitals)
    }, [city]);

    useEffect(() => {
        console.log(hospital)
    }, [hospital]);

    const getCitiesFromJSON = () => {
        setCity("")
        if (country != "ca") {
            fetch( './' + country +'/hospitals.json' )
            .then( response => response.text() )
            .then( json => {
                const obj = JSON.parse(json)
                let set = new Set()
                for (let item in obj){
                    console.log(obj[item]["city"])
                    set.add(obj[item]["city"])
                }
                setCities(Array.from(set))
            })
        }
        else {
            fetch( './ca/hospitals.json' )
            .then( response => response.text() )
            .then( json => {
                const obj = JSON.parse(json)
                let hosp = []
                for (let item in obj){
                    console.log(obj[item]["city"])
                    hosp.push(obj[item]["city"])
                    // setHospitals(prev => [...prev, obj[item]["name"]])
                }
                setCities(hosp)
            })
        }
    }

    const getHospitalsFromJSON = () => {
        setHospital("")
        if (country != "ca") {
            fetch( './' + country +'/hospitals.json' )
            .then( response => response.text() )
            .then( json => {
                const obj = JSON.parse(json)
                let hosp = []
                for (let item in obj){
                    if (obj[item]["city"] == city){
                        hosp.push({"id": obj[item]["id"], "name": obj[item]["name"]})
                    }
                }
                setHospitals(hosp)
            })
        }
        else {
            fetch( './ca/hospitals.json' )
            .then( response => response.text() )
            .then( json => {
                const obj = JSON.parse(json)
                let hosp = []
                for (let item in obj){
                    console.log(obj[item]["name"])
                    hosp.push({"id": obj[item]["id"], "name": obj[item]["name"]})
                }
                setHospitals(hosp)
            })
        }
    };

    const addDoctor = async () => {
        const networkId = await web3.eth.net.getId()
        const networkData = Hospitals.networks[networkId] 
        if(networkData) {
            const accounts = await web3.eth.getAccounts()
            const hospitalContract = new web3.eth.Contract(Hospitals.abi, networkData.address)
            hospitalContract.methods.addDoctor(accounts[0], age, name, specialization, hospital).send({ from: accounts[0] }).on('transactionHash', (hash) => {
            })
    //         const Doctor1 = await hospitalContract.methods.getDoctor(accounts[0]).call();
    //   console.log(Doctor1)
        }
        navigate('/menu')
        
    }

    let menuItems=[];
    countries.map((item,index)=>{
        menuItems.push( <MenuItem key={item.abbreviation}>{item.country}</MenuItem> )
      })

    return (
        <div>
            <Box sx={{ minWidth: 120 }}>
            <TextField id="name-text" label="Name" variant="outlined" value={name} onChange={(e) => {setName(e.target.value);}}/>
            <TextField id="name-text" label="Age" variant="outlined" value={age} onChange={(e) => {setAge(e.target.value);}}/>
            <TextField id="name-text" label="Specialization" variant="outlined" value={specialization} onChange={(e) => {setSpecialization(e.target.value);}}/>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select   
                value={country}
                label="Country"
                onChange={(e) => {setCountry(e.target.value);}}>
                 {countries.map((c) => (
                <MenuItem key={c.abbreviation} value={c.abbreviation} defaultValue="">
                    {c.country}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel>City</InputLabel>
                <Select   
                    value={city}
                    label="City"
                    onChange={(e) => {setCity(e.target.value); console.log(city)}}>
                    {cities.map((c) => (
                     <MenuItem key={c} value={c} defaultValue="">
                     {c}
                     </MenuItem>
                    ))}
                </Select>
            </FormControl>  
            <FormControl fullWidth>
            <InputLabel>Hospital</InputLabel>
                <Select   
                    value={hospital}
                    label="Hospital"
                    onChange={(e) => {setHospital(e.target.value); console.log(hospital)}}>
                    {hospitals.map((c) => (
                     <MenuItem key={c["id"]} value={c["id"]} defaultValue="">
                     {c["name"]}
                     </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={() => {addDoctor()}}>Submit</Button>
        </Box>
        </div>
    )
}

export default DoctorForm;