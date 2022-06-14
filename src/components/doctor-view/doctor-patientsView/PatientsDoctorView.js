import * as React from 'react';
import Navbar from '../navbar/Navbar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { textTransform } from '@mui/system';
import CustomizedDialogs from './CustomizedDialogs';
import Web3 from 'web3';
import Patients from '../../../abis/Patients.json';
import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../../SearchBar';

const drawerWidth = 200

const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 80 },
    { id: 'lastName', label: 'Last Name', minWidth: 80 },
    { id: 'birthDate', label: 'Birth Date', maxWidth: 20 },
    {
        id: 'gender',
        label: 'Gender',
        minWidth: 40,
        align: 'left'
      },
    {
      id: '_addressLocation',
      label: 'Address',
      maxWidth: 40,
      align: 'left'
    },
    {
      id: 'city',
      label: 'City',
      minWidth: 40,
      align: 'left'
    },
    {
        id: 'country',
        label: 'Country',
        minWidth: 40,
        align: 'left'
      },
      {
        id: 'CNP',
        label: 'CNP',
        minWidth: 40,
        align: 'left'
      },
      {
        id: '_address',
        label: 'Account Address',
        minWidth: 40,
        align: 'left'
      },
  ];
  
  function createData(fname, lname, birthDate, gender, address, city, country, cnp, acc_address) {
    return { fname, lname, birthDate, gender, address, city, country, cnp, acc_address};
  }

export default function DoctorPatientsView(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [patients, setPatients] = React.useState([])
    const [searched, setSearched] = React.useState("")

  
    
    const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
    };

    useEffect(() => {
        loadWeb3();
        loadPatients()
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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

    const loadPatients = async () =>
    {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = Patients.networks[networkId]
        if(networkData) {
            const patientC = new web3.eth.Contract(Patients.abi, networkData.address)
            const accounts = await web3.eth.getAccounts()
            const patients = await patientC.methods.getPatientsOfDoctor(accounts[0]).call();
            console.log(patients)
            setPatients(patients)
            // for (let i = 0; i < patients.length; i++)
            // {
            //     rows.push(createData(patients[i]["firstName"], patients[i]["lastName"], patients[i]["birthDate"],
            //     patients[i]["gender"], patients[i]["city"], patients[i]["country"],
            //     patients[i]["cnp"], patients[i]["country"], patients[i]["cnp"]))
                
            //     console.log(rows)
            // }
        }
    }

    const rows = [
        
    ]

    return (
        <div>
        <Navbar account={props.account} currentPage="Patients"/>
        
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'white', p: 1, paddingTop:6, paddingLeft: 26, width: { sm: `calc(100% - ${drawerWidth - 210}px)`} }}
        > 
        <Paper sx={{ width: '30%', overflow: 'hidden' }}>
        <SearchBar placeholder="Search"
                    onChange={(event) => setSearched(event.target.value)}
                    searchBarWidth='300px'></SearchBar>
        </Paper>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "5px" }}>
            
            <TableContainer sx={{ maxHeight: 430, top: "10px"}}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    <TableCell align='center'>
                        History
                    </TableCell>
                    </TableRow>        
                </TableHead>
                <TableBody>
                    {patients.filter((val) => {
                        if (searched == ""){
                            return val
                        }
                        else if (val.firstName.toLowerCase().includes(searched.toLowerCase()))
                        {
                            return val
                        }
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.CNP}>
                            {columns.map((column) => {
                                let value = 0;
                                if (column.id == "birthDate")
                                {
                                    var date = new Date(row[column.id] * 1000);
                                    var dd = String(date.getDate()).padStart(2, '0');
                                    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
                                    var yyyy = date.getFullYear();
                                    value = dd + '/' + mm + '/' + yyyy;
                                    console.log(value)
                                }
                                else if (column.id == "_address")
                                {
                                    value = row[column.id].substring(0,10) + "..."
                                }
                                else
                                    value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                            );
                            })}
                            <TableCell align='center'>
                            <Button variant="contained" size="medium" sx={{textTransform: "none"}}>
                                View History     
                            </Button>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
            {/* <Button variant="contained" size="medium" sx={{marginTop: "10px", textTransform: "none"}}  onClick={handleClickOpen}>
                Add Patient     
            </Button> */}
            <CustomizedDialogs patients={patients}/>
            
        </Box>
    </div>
    );
}
