import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Login from './Login';
import Web3 from 'web3';
import './App.css';
import { Routes, Route, BrowserRouter } from  'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Register from './register/Register';
import Hospitals from '../abis/Hospitals.json';
import DoctorDashboard from './doctor-view/doctor-dashboard/DoctorDashboard';
import Patients from './doctor-view/doctor-patientsView/Patients';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

function App(){
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     account: '',
  //     dstorage: null,
  //     files: [],
  //     loading: false,
  //     type: null,
  //     name: null
  //   }
  //   this.uploadFile = this.uploadFile.bind(this)
  //   this.captureFile = this.captureFile.bind(this)
  // }

  const [account, setAccount] = useState('');
  const [dstorage, setDstorage] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [filesCount, setFilesCount] = useState(0);
  const [buffer, setBuffer] = useState(null);
  
  const [hospitals, setHospitals] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [doctor, setDoctor] = useState({address: "12", age: 10, doctorName: "nume", specialization: "sp"});
  const age = doctor.age;
  const doctorName = doctor.doctorName;
  const specialization = doctor.specialization;
  const address = doctor.address;

  useEffect(() => {
    loadWeb3()
    loadAccount()
    loadBlockchainData()
}, []);

  // componentWillMount() {
  //   await this.loadWeb3()
  //   await this.loadAccount()
  //   await this.loadBlockchainData()
  // }

  const loadWeb3 = async () => {
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

  const loadAccount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()

    // this.setState({ account: accounts[0] })
    setAccount(accounts[0])
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()

    // this.setState({ account: accounts[0] })
    setAccount(accounts[0])

    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    const networkData1 = Hospitals.networks[networkId]
    console.log(account)
    if(networkData) {
      // Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      const hospitals = new web3.eth.Contract(Hospitals.abi, networkData1.address)
      setHospitals(hospitals)

      // const Doctor1 = await hospitals.methods.getDoctor("0x89c7Ac6fdd489C432a4ffDbE4a576083cD15B4FB").call();
      // console.log(Doctor1)
      // hospitals.methods.addHospital(1, "Spitalul de urgente", "Cluj-Napoca", "Romania").send({ from: accounts[0] }).on('transactionHash', (hash) => {
      //   //   this.setState({
      //   //    loading: false,
      //   //    type: null,
      //   //    name: null
      //   //  })
      //   setLoading(false)
      //    window.location.reload()
      //   }).on('error', (e) =>{
      //     window.alert('Error')
      //     // this.setState({loading: false})
      //     setLoading(false)
      //   })
      // const hospital1 = await hospitals.methods.getHospital(1).call();
      // console.log(hospital1)

      const doctors = await hospitals.methods.getDoctorsInAHospital(1).call();
      console.log(doctors)

      // hospitals.methods.addDoctor("0x681536517EEd5a1622485bf61119F27F477A871f", 46, "Doctor2", "skin", 1).send({ from: accounts[0] }).on('transactionHash', (hash) => {
      //   //   this.setState({
      //   //    loading: false,
      //   //    type: null,
      //   //    name: null
      //   //  })
      //   setLoading(false)
      //    window.location.reload()
      //   }).on('error', (e) =>{
      //     window.alert('Error')
      //     // this.setState({loading: false})
      //     setLoading(false)
      //   })
      // console.log(doctor.name)
      
      // this.setState({ dstorage })
      setDstorage(dstorage)

      const isDoctor = await dstorage.methods.isDoctor(accounts[0]).call();
      // this.setState({ isDoctor })
      console.log(isDoctor)

      // Get files amount
      const filesCount = await dstorage.methods.fileCount().call()
      // this.setState({ filesCount })

      //const members = await dstorage.methods.members(file.uploader).call()
      //this.setState({ members })
      // Load files&sort by the newest
      for (var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        const members = await dstorage.methods.members(accounts[0]).call()
        //console.log(members)
        if (members)
        // this.setState({
        //   files: [...this.state.files, file]
        // })
        setFiles([...files, file])
      }
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  // const captureFile = useCallback(() => {
  //   const file = event.target.files[0]
  //   const reader = new window.FileReader()

  //   reader.readAsArrayBuffer(file)
  //   reader.onloadend = () => {
  //     this.setState({
  //       buffer: Buffer(reader.result),
  //       type: file.type,
  //       name: file.name
  //     })
  //     console.log('buffer', this.state.buffer)
  // }, [todos]);

  // Get file from user
  const captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      // this.setState({
      //   buffer: Buffer(reader.result),
      //   type: file.type,
      //   name: file.name
      // })
      setBuffer(Buffer(reader.result))
      setType(file.type)
      setName(file.name)
      console.log('buffer', buffer)
    }
  }

  const uploadFile = description => {
    console.log("Submitting file to IPFS...")

    // Add file to the IPFS
    ipfs.add(buffer, (error, result) => {
      console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return
      }

      // this.setState({ loading: true })
      setLoading(true)
      // Assign value for the file without extension
      if(type === ''){
        // this.setState({type: 'none'})
        setType('none')
      }
      dstorage.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: account }).on('transactionHash', (hash) => {
      //   this.setState({
      //    loading: false,
      //    type: null,
      //    name: null
      //  })
      setLoading(false)
      setType(null)
      setName(null)
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        // this.setState({loading: false})
        setLoading(false)
      })
    })
  }

  
    return (
      <div>
        {doctor.age}
        <BrowserRouter>
          <Routes>
            <Route path="/files" exact element={<><Navbar account={account}/>
                                             <Main files={files}
                                                   captureFile={captureFile}
                                                   uploadFile={uploadFile}/></>}/>
            <Route path="/login" exact element={<Login account={account}/>} />
            <Route path="/register" exact element={<Register account={account}/>} />
            <Route path="/doctor-dashboard" exact element={<DoctorDashboard account={account}/>} />
            <Route path="/patients" exact element={<Patients account={account}/>} />
          </Routes>
        </BrowserRouter>
        {/* { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        } */}
      </div>
    );
  
}

export default App;