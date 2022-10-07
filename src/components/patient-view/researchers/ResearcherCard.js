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

export default function ResearcherCard(props) {
  const navigate = useNavigate();


  return (
    <Card key={props.researcher._address}>
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          Research Team
        </Typography>
        <Typography style={{display: 'inline-block'}}>
         {props.researcher.name}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Country
        </Typography>
        <Typography variant="body2">
            {props.researcher.country}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          City
        </Typography>
        <Typography variant="body2">
            {props.researcher.city}
        </Typography>
        <Typography sx={{mt: 1}} color="text.secondary">
          Number of patients
        </Typography>
        <Typography variant="body2">
          {props.researcher.nrOfPatients}
        </Typography>
      </CardContent>
    </Card>
  );
}