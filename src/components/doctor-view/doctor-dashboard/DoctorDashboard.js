import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import UpcomingAppoitments from './UpcomingAppitments';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { padding } from '@mui/system';
import ProgressChart from './ProgressChart';
import { useNavigate } from "react-router-dom";
import Navbar from '../navbar/Navbar';

const drawerWidth = 200;

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: "45vh"
}));


function DoctorDashboard(props){
  
    return (
      <div>
       <Navbar account={props.account} currentPage="Dashboard"/>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#fafafa', p: 1, paddingTop:6, paddingLeft: 25, width: { sm: `calc(100% - ${drawerWidth - 210}px)`} }}
      >
        {/* <Toolbar/> */}
        <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 4, md: 4}}>
          <Grid item xs={2} sm={2} md={2}>
            <Item><UpcomingAppoitments/></Item>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <Item sx={{paddingTop: 0}}>
                <ProgressChart />
            </Item>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <Item>Completed appoitments today</Item>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <Item>Pending Invitations</Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default DoctorDashboard