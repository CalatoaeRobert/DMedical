import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from "react-router-dom";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function AppointmentCard(props) {
  const navigate = useNavigate();


  return (
    <Card key={props.appointment.doctorProfile}>
      <CardMedia
          component="img"
          height="150"
          image={props.profilePic}
          alt="green iguana"
          
        />
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          MEDIC SPECIALIST
        </Typography>
        <Typography style={{display: 'inline-block'}}>
         Dr. {props.appointment.name}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          City
        </Typography>
        <Typography variant="body2">
            {props.appointment.city}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Hospital
        </Typography>
        <Typography variant="body2">
          {props.appointment.hospital}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Date
        </Typography>
        <Typography variant="body2">
          {props.appointment.date}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Starting hour
        </Typography>
        <Typography variant="body2">
          {props.appointment.startingHour}
        </Typography>
      </CardContent>
    </Card>
  );
}