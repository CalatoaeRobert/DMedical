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
import Card from '@mui/material/Card';
import { useNavigate } from "react-router-dom";

const drawerWidth = 200;

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: "45vh"
}));

export default function Navbar(props) {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth + 5}px)`, ml: `${drawerWidth + 5}px`, backgroundColor: "white", color: "black", borderRadius: 1}}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{fontSize: 15}}>
            {props.currentPage}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#06603A",
            borderRadius: 1,
            color: "#D8ECE4"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button>
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
          </ListItem>
          <ListItem button onClick={() => navigate("/doctor-dashboard")}>
            <ListItemIcon>
              <InboxIcon sx={{color: "#D8ECE4"}}/>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => navigate("/patients")}>
            <ListItemIcon>
              <InboxIcon sx={{color: "#D8ECE4"}}/>
            </ListItemIcon>
            <ListItemText primary="Patients" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon sx={{color: "#D8ECE4"}}/>
            </ListItemIcon>
            <ListItemText primary="Appoitments" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon sx={{color: "#D8ECE4"}}/>
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon sx={{color: "#D8ECE4"}}/>
            </ListItemIcon>
            <ListItemText primary="Invitations" />
          </ListItem>
        </List>
      </Drawer>
      </Box>
    );
}