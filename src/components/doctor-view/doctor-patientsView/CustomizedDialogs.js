import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{textTransform: 'none'}}>
        Add Patient
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a patient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="City"
            type="city"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Country"
            type="country"
            fullWidth
            variant="standard"
          />
           {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
            label="Date desktop"
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
            />
           </LocalizationProvider> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}