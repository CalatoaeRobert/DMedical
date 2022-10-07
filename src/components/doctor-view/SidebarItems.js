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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MainListItems(props){
  const navigate = useNavigate();

  return (
    <React.Fragment>

    <ListItemButton>
        <ListItemIcon>
          <FontAwesomeIcon icon="fa-solid fa-user" size="lg"/>
        </ListItemIcon>
        <ListItemText disableTypography primary={<a target="_blank"
            alt=""
            rel="noopener noreferrer"
            href={"https://etherscan.io/address/" + props.account}>
          {props.account.substring(0,6)}...{props.account.substring(38,42)}
        </a>}/>
    </ListItemButton>

    <ListItemButton onClick={() => navigate('/doctor/patients')}>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-hospital-user" size='lg'/>
      </ListItemIcon>
      <ListItemText primary="Patients" />
    </ListItemButton>

    <Divider />

    <ListItemButton onClick={() => navigate('/doctor/appointment-history')}>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-calendar-check" size="lg"/>
      </ListItemIcon>
      <ListItemText primary="Appoitments" />
    </ListItemButton>

    <ListItemButton onClick={() => navigate('/doctor/calendar')}>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-calendar-days" size='lg' />
      </ListItemIcon>
      <ListItemText primary="Calendar" />
    </ListItemButton>
    </React.Fragment>
  )
}
