import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Appointments from '../../../abis/Appointments.json';
import Patients from '../../../abis/Patients.json';
import Hospitals from '../../../abis/Hospitals.json'
import Files from '../../../abis/Files.json'
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Scheduler from "react-mui-scheduler"

export default function DataGridDemo() {
  const [patients, setPatients] = React.useState([])
  const [historiesApproved, setHistoriesApproved] = React.useState([])
  const [state] = React.useState({
    options: {
      transitionMode: "zoom", // or fade
      startWeekOn: "mon",     // or sun
      defaultMode: "month",    // or week | day | timeline
      minWidth: 540,
      maxWidth: 540,
      minHeight: 540,
      maxHeight: 540
    },
    toolbarProps: {
      showSearchBar: true,
      showSwitchModeButtons: true,
      showDatePicker: true
    }
  })

  const events = [
    {
      id: "event-1",
      label: "Medical consultation",
      groupLabel: "Dr Shaun Murphy",
      user: "Dr Shaun Murphy",
      color: "#f28f6a",
      startHour: "04:00 AM",
      endHour: "05:00 AM",
      date: "2022-05-05",
      createdAt: new Date(),
      createdBy: "Kristina Mayer"
    },
    {
      id: "event-2",
      label: "Medical consultation",
      groupLabel: "Dr Claire Brown",
      user: "Dr Claire Brown",
      color: "#099ce5",
      startHour: "09:00 AM",
      endHour: "10:00 AM",
      date: "2022-05-09",
      createdAt: new Date(),
      createdBy: "Kristina Mayer"
    },
    {
      id: "event-3",
      label: "Medical consultation",
      groupLabel: "Dr Menlendez Hary",
      user: "Dr Menlendez Hary",
      color: "#263686",
      startHour: "13 PM",
      endHour: "14 PM",
      date: "2022-05-10",
      createdAt: new Date(),
      createdBy: "Kristina Mayer"
    },
    {
      id: "event-4",
      label: "Consultation prénatale",
      groupLabel: "Dr Shaun Murphy",
      user: "Dr Shaun Murphy",
      color: "#f28f6a",
      startHour: "08:00 AM",
      endHour: "09:00 AM",
      date: "2022-05-11",
      createdAt: new Date(),
      createdBy: "Kristina Mayer"
    }
  ]

  const navigate = useNavigate();

  function getBirthDate(params) {
    var date = new Date(params.row.birthDate * 1000);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    let value = dd + '/' + mm + '/' + yyyy;
    return value;
  }
  
  function getSkills(params) {
    let skillsString = ""
    console.log(params.row.skills)
    for (let i = 0; i < params.row.skills.length; i++)
    {
      console.log(params.row.skills[i])
      skillsString += params.row.skills[i] + ", "
      if (i == (params.row.skills.length - 1))
      {
        skillsString += params.row.skills[i]
      }
    }
    console.log(skillsString)
  
    return skillsString;
  }
  
  const columns = [
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 120,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 100,
    },
    {
      field: 'city',
      headerName: 'City',
      width: 100,
    },
    {
      field: 'birthDate',
      headerName: 'Birth date',
      type: 'date',
      width: 100,
      valueGetter: getBirthDate,
    },
    {
      field: '_addressLocation',
      headerName: 'Location',
      width: 160,
      renderCell: renderCellExpand 
    },
    {
      field: 'CNP',
      headerName: 'CNP',
      type: "numeric",
      width: 150,
    },
    {
      field: '_address',
      headerName: 'Address',
      width: 160,
      renderCell: renderCellExpand 
    },
  ];

  React.useEffect(() => {
    loadWeb3()
    getPatients()
    loadRequests()
  }, [])

  const loadWeb3 = async () =>
    {
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

  const loadRequests = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Files.networks[networkId]
    const accounts = await web3.eth.getAccounts()

    if(networkData) {
        const filesContract = new web3.eth.Contract(Files.abi, networkData.address)

        const historyList = await filesContract.methods.getHistoryAvailableForDoctor(accounts[0]).call();
        setHistoriesApproved(historyList)
    }
  }

  const getPatients = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = Appointments.networks[networkId]
    const patientsData = Patients.networks[networkId]

    let patientsList = []

    if(networkData) {
        const appContract = new web3.eth.Contract(Appointments.abi, networkData.address)
        const patientsContract = new web3.eth.Contract(Patients.abi, patientsData.address)

        const accounts = await web3.eth.getAccounts()
        const patients = await appContract.methods.getPatientsOfADoctor(accounts[0]).call();
        
        console.log(patients)
        
        for (let i = 0; i < patients.length; i++)
        {
          const patient = await patientsContract.methods.getPatient(patients[i]).call();
          console.log(patient)
          patientsList.push(patient)
        }
    }
    setPatients(patientsList)
  }

  const handleCellClick = (event, row, day) => {
    console.log(row)
  }
  
  const handleEventClick = (event, item) => {
    console.log(item)
  }
  
  const handleEventsChange = (item) => {
    // Do something...
  }
  
  const handleAlertCloseButtonClicked = (item) => {
    // Do something...
  }

  return (
    <div style={{ width: '100%' }}>
      <Scheduler
      locale="en"
      events={events}
      legacyStyle={false}
      options={state?.options}
      toolbarProps={state?.toolbarProps}
      onEventsChange={handleEventsChange}
      onCellClick={handleCellClick}
      onTaskClick={handleEventClick}
      onAlertCloseButtonClicked={handleAlertCloseButtonClicked}
    />
    </div>
  );
}