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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MainListItems(props){
  const navigate = useNavigate();

  return (
    <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-hospital-user" size='lg'/>
      </ListItemIcon>
      <ListItemText primary="Patients" onClick={() => navigate('/researcher/get-history')}/>
    </ListItemButton>
    {/* <Divider /> */}

    <ListItemButton>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-notes-medical" size="lg"/>
      </ListItemIcon>
      <ListItemText primary="Medical History" onClick={() => navigate('/researcher/patients')}/>
    </ListItemButton>

    </React.Fragment>
  )
}
