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
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Patients" onClick={() => navigate('/researcher/buy-history')}/>
    </ListItemButton>
    {/* <Divider /> */}

    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Medical History" onClick={() => navigate('/researcher/patients')}/>
    </ListItemButton>

    <Divider />

    </React.Fragment>
  )
}
