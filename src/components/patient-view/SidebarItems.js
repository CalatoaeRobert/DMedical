import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from "react-router-dom";
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';

export default function MainListItems(props){
  const navigate = useNavigate();

  return (
    <React.Fragment>
    {/* <ListItemButton>
        <ListItemIcon>
          <PersonIcon sx={{color: "#D8ECE4"}}/>
        </ListItemIcon>
        <ListItemText disableTypography primary={<a target="_blank"
            alt=""
            className="black"
            style={{color: "#D8ECE4"}}
            rel="noopener noreferrer"
            href={"https://etherscan.io/address/" + props.account}>
          {props.account.substring(0,6)}...{props.account.substring(38,42)}
        </a>}/>
    </ListItemButton> */}
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    {/* <Divider /> */}

    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Medical History"/>
    </ListItemButton>

    <Divider />
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Doctors" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="History Approval Requests" primaryTypographyProps={{ style: { whiteSpace: "normal" } }} onClick={() => navigate('/patient/invitations')}/>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Appointments" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Calendar" />
    </ListItemButton>

    <Divider />

    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Medical Tests" />
    </ListItemButton><ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Investigation and prices" primaryTypographyProps={{ style: { whiteSpace: "normal" } }}/>
    </ListItemButton>

    </React.Fragment>
  )
}
