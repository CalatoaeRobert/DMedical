import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Appointments from '../../../abis/Appointments.json';
import Patients from '../../../abis/Patients.json';
import Hospitals from '../../../abis/Hospitals.json'
import Web3 from 'web3';
import renderCellExpand from '../GridCellExpand';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Scheduler from "react-mui-scheduler"

export default function DataGridDemo() {
  const [patients, setPatients] = React.useState([])
  const [appointments, setAppointments] = React.useState([{
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
      }])
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

  const navigate = useNavigate();

  function getBirthDate(params) {
    var date = new Date(params.row.birthDate * 1000);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    let value = dd + '/' + mm + '/' + yyyy;
    return value;
  }

  React.useEffect(() => {
    loadWeb3()
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
    const networkData = Appointments.networks[networkId]
    const patientsData = Patients.networks[networkId]
    const hospitalData = Hospitals.networks[networkId]

    const accounts = await web3.eth.getAccounts()

    if(networkData) {
        const appointmentsContract = new web3.eth.Contract(Appointments.abi, networkData.address)
        const patientsContract = new web3.eth.Contract(Patients.abi, patientsData.address)
        const hospitalContract = new web3.eth.Contract(Hospitals.abi, hospitalData.address)

        const appointments = await appointmentsContract.methods.getAppointmentsOfPatient(accounts[0]).call();

        let appointmentsList = []

        for (let i = 0; i < appointments.length; i++){
          let appointment = {}
          appointment.id = `event-${i}`
          appointment.label = "Consultation"

          const doctor = await hospitalContract.methods.getDoctor(appointments[i]['doctor']).call();

          appointment.user = doctor['lastName'] + ' ' + doctor['firstName']
          appointment.groupLabel = doctor['lastName'] + ' ' + doctor['firstName']
          appointment.color = "#f28f6a"

          const myArray = appointments[i]['startingHour'].split(":");
          if (parseInt(myArray[0]) < 12){
            appointment.startHour = appointments[i]['startingHour'] + " AM"
            if (parseInt(myArray[1]) == 30){
              if (parseInt(myArray[0]) == 11){
                appointment.endHour = parseInt(myArray[0]) + 1 + ":00 PM"
              }
              else{
                appointment.endHour = parseInt(myArray[0]) + 1 + ":00 AM"
              }
            }
            else{
              appointment.endHour = myArray[0] + ":30 AM"
            }
          }
          else{
            appointment.startHour = appointments[i]['startingHour'] + " PM"
            if (parseInt(myArray[1]) == 30){
                appointment.endHour = parseInt(myArray[0]) + 1 + ":00 PM"
            }
            else{
              appointment.endHour = myArray[0] + ":30 PM"
            }
          }

          const dString = appointments[i]['dateString'].split("/");
          appointment.date = dString[2] + "-" + dString[1] + "-" + dString[0]
          appointment.createdAt = new Date()

          let patient = await patientsContract.methods.getPatient(accounts[0]).call()
          appointment.createdBy = patient['firstName'] + " " + patient['lastName']

          appointmentsList.push(appointment)
          console.log(appointment)
        }
        setAppointments(appointmentsList)
    }
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
      events={appointments}
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