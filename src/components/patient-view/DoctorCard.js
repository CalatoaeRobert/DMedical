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

export default function DoctorCard(props) {
  const navigate = useNavigate();

  const appointmentTo = (walletAddress) => {
    navigate(`/appointment/${walletAddress}`)
  }

  return (
    <Card sx={{ minWidth: 250 }} key={props.walletAddress}>
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
         Dr. {props.doctor.firstName} {props.doctor.lastName}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          City
        </Typography>
        <Typography variant="body2">
            {props.doctor.city}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Hospital
        </Typography>
        <Typography variant="body2">
          {props.doctor.hospital}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Specialization: {props.doctor.specialization}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Skills:
        </Typography>
        <Typography variant="body2">
          {props.doctor.skills.map((skill) => (
                <ListItemText key={skill}>
                {skill}
              </ListItemText>
            ))}
        </Typography>
      </CardContent>
      <CardActions style={{justifyContent: 'center'}}>
        <Button size="small" variant="contained" sx={{mb: 1}} onClick={() => navigate({
                                                              pathname: '/book-appointment',
                                                                search: `?doctor=${props.doctor.walletAddress}`,
                                                              })}>Book Apointment</Button>
      </CardActions>
    </Card>
  );
}