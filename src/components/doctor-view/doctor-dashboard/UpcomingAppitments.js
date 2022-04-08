import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function createData(name, hour, problem) {
  return { name, hour, problem};
}

const rows = [
  createData('Ion Popescu', "10:15", "Stomach"),
  createData('Maria Ileana', "12:25", "Headache"),
  createData('Vasile Florin', "13:00", "Consultation"),
  createData('Elena Voicu', "13:30", "Fever"),
  createData('Robert Andrei', "14:15", "Coughing"),
];

export default function UpcomingAppoitments() {
  return (
      <div>
          <Typography
          sx={{ flex: '1 1 100%', fontSize: 15, textAlign: "center", color: "black" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Upcoming appoitments
        </Typography>
          <TableContainer component={Paper} sx={{height: 240}}>
      <Table sx={{ minWidth: 650, tableLayout: "auto", width:"100%", height: "max-content" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Hour</TableCell>
            <TableCell>Problem</TableCell>
            <TableCell>Complete / Cancel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell >{row.hour}</TableCell>
              <TableCell>{row.problem}</TableCell>
              <TableCell><CheckCircleIcon sx={{color: "red"}}/></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>    
      </div>
      
    
  );
}