import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Pie, Doughnut} from 'react-chartjs-2';
import 'chart.js/auto';

export default function ProgressChart() {
    const data01 = {
        labels: ['Completed', 'Remaining', 'Canceled'],
        datasets: [
            {
            label: 'Rainfall',
            backgroundColor: [
                '#06603A',
                '#e6e2e1',
                '#a63019',
            ],
            hoverBackgroundColor: [
            '#06663e',
            '#ebe7e6',
            '#ab321a',
            ],
            data: [5, 2, 1]
            }
        ]
    };

    return (
        <div style={{ position: "relative", margin: "auto", width: "18vw" }}>
             <Typography
          sx={{ flex: '1 1 100%', fontSize: 15, textAlign: "center", color: "black" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
         Progress Today
        </Typography>
            <Pie
        data={data01}
        options={{
          title:{
            display:true,
            text:'Average Rainfall per month',
            fontSize:20
          },
          plugins: {
            legend:{
                display:true,
                position:'bottom'
              }
          }
          
        }}
      />
        </div>
        )
}