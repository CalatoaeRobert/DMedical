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
          <FontAwesomeIcon icon="fa-solid fa-user" size="lg"/>
        </ListItemIcon>
        <ListItemText disableTypography primary={<a target="_blank"
            alt=""
            
            // style={{color: "#D8ECE4"}}
            rel="noopener noreferrer"
            href={"https://etherscan.io/address/" + props.account}>
          {props.account.substring(0,6)}...{props.account.substring(38,42)}
        </a>}/>
    </ListItemButton>
 
    {/* <Divider /> */}

    <ListItemButton>
      <ListItemIcon>
      <FontAwesomeIcon icon="fa-solid fa-notes-medical" size="lg"/>
      </ListItemIcon>
      <ListItemText primary="Medical History" onClick={() => navigate('/my-history')}/>
    </ListItemButton>

    <Divider />
    <ListItemButton>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-user-doctor" size="lg"/>
      </ListItemIcon>
      <ListItemText primary="Doctors" onClick={() => navigate('/home')}/>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
      <FontAwesomeIcon icon="fa-solid fa-handshake-angle" size="lg" />
      </ListItemIcon>
      <ListItemText primary="History Approval Requests" primaryTypographyProps={{ style: { whiteSpace: "normal" } }} onClick={() => navigate('/patient/invitations')}/>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-calendar-check" size="lg"/>
      </ListItemIcon>
      <ListItemText primary="Appointments" onClick={() => navigate('/appointment-history')}/>
    </ListItemButton>

    <Divider />

    <ListItemButton>
      <ListItemIcon>
        <FontAwesomeIcon icon="fa-solid fa-flask-vial" size="lg"/>
      </ListItemIcon>
      <ListItemText primary="Researchers" onClick={() => navigate('/researchers')} />
    </ListItemButton>

    </React.Fragment>
  )
}
