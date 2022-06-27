import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect, useCallback } from 'react';
import { ControlCameraSharp } from '@material-ui/icons';
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Paper from '@mui/material/Paper';

export default function ControlledAccordions(props) {
  const [expanded, setExpanded] = useState(false);
  const [immunizations, setImmunizations] = useState([]);
  const [timelineIm, setTimelineIm] = useState([1,2]);
  const [im, setIm] = useState("")

  const [condition, setCondition] = useState("")
  const [conditions, setConditions] = useState([])
  const [conditionStart, setConditionStart] = useState("");
  const [conditionStop, setConditionStop] = useState("");
  const [conditionCodes, setConditionCodes] = useState("")

  const [careplans, setCareplans] = useState([])
  const [injuries, setInjuries] = useState([])
  const [medications, setMedications] = useState([])
  const [tests, setTests] = useState([])

  function compare(a,b) {
    if (a.stop < b.stop || (a.stop == b.stop && a.start > b.start))
      return -1;
    if (a.stop > b.stop || (a.stop == b.stop && a.start < b.start))
      return 1;
    return 0;
  }

  function getDate(params) {
    var date = new Date(params);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    let value = dd + '/' + mm + '/' + yyyy;
    return value;
  }

  const loadConditions = () => {
    let conditionsBuilder = []
    try {
      const json = JSON.parse(JSON.parse(JSON.stringify(props.history)));
      for (var keys of Object.keys(json['attributes'])){
        if ((keys.toLowerCase().includes("condition")) && (!keys.includes("employment")) && (!keys.includes("education"))){
          let condition = {}
          condition.name = keys
          let codes = []
          for (let i = 0; i < json['attributes'][keys]['codes'].length; i++){
            codes.push(json['attributes'][keys]['codes'][i])
          }
          condition.code = codes
          condition.start = getDate(json['attributes'][keys]['start'])
          condition.stop = getDate(json['attributes'][keys]['stop'])

          conditionsBuilder.push(condition)
        }
      }
      setConditions(conditionsBuilder)
    
    }catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log('error', err);
    }
  }

  const loadImmunization = () => {
    
    var immuzationBuilder = []

    try {
      const json = JSON.parse(JSON.parse(JSON.stringify(props.history)));
      
      for (var immunization of Object.keys(json['attributes']['immunizations'])) {
        if (json['attributes']['immunizations'][immunization].length != 0)
        {
          let imm = {}
          imm[immunization] = json['attributes']['immunizations'][immunization]
          immuzationBuilder.push(imm)
          // immuzationBuilder[immunization] = json['attributes']['immunizations'][immunization]
          // immuzationBuilder.push({immunization: json['attributes']['immunizations'][immunization]})
        }
      }
      setImmunizations(immuzationBuilder)
      console.log(immuzationBuilder)
    } catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log('error', err);
    }
    
  }

  const loadCareplans = () => {
    let careplansBuilder = []
    try {
      const json = JSON.parse(JSON.parse(JSON.stringify(props.history)));
      
      for (var keys of Object.keys(json['attributes'])){
        if ((keys.toLowerCase().includes("careplan"))){
          let careplan = {}
          careplan.activities = json['attributes'][keys]['activities']
          careplan.reasons = json['attributes'][keys]['reasons']
          careplan.codes = json['attributes'][keys]['codes']
          careplan.stop = json['attributes'][keys]['stop']
          careplan.start = json['attributes'][keys]['start']
          careplansBuilder.push(careplan)
        }
      }
      careplansBuilder.sort(compare)
      console.log(careplansBuilder)
      setCareplans(careplansBuilder)
    } catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log('error', err);
    }
  }

  const loadInjuries = () => {
    let injuriesBuilder = []
    try {
      const json = JSON.parse(JSON.parse(JSON.stringify(props.history)));
      
      for (var keys of Object.keys(json['attributes'])){
        if ((!keys.toLowerCase().includes("careplan") && keys.toLowerCase().includes("injury"))){
          let injury = {}
          injury.codes = json['attributes'][keys]['codes']
          injury.stop = json['attributes'][keys]['stop']
          injury.start = json['attributes'][keys]['start']
          injuriesBuilder.push(injury)
        }
      }
      injuriesBuilder.sort(compare)
      console.log(injuriesBuilder)
      setInjuries(injuriesBuilder)
    } catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log('error', err);
    }
  }

  const loadMedications = () => {
    let medicationsBuilder = []
    try {
      const json = JSON.parse(JSON.parse(JSON.stringify(props.history)));
      
      for (var keys of Object.keys(json['attributes'])){
        if (((keys.toLowerCase().includes("med") || keys.toLowerCase().includes("antibiotic") || 
        keys.toLowerCase().includes("prescription"))) && (!keys.toLowerCase().includes("step"))){
          let medication = {}
          medication.stopReason = json['attributes'][keys]['stopReason']
          medication.reasons = json['attributes'][keys]['reasons']
          medication.codes = json['attributes'][keys]['codes']
          medication.stop = json['attributes'][keys]['stop']
          medication.start = json['attributes'][keys]['start']
          medicationsBuilder.push(medication)
        }
      }
      medicationsBuilder.sort(compare)
      console.log(medicationsBuilder)
      setMedications(medicationsBuilder)
    } catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log('error', err);
    }
  }

  const loadTests = () => {
    let testsBuilder = []
    try {
      const json = JSON.parse(JSON.parse(JSON.stringify(props.history)));
      
      //console.log(json['record']['encounters']['observations'])
      for (let i = 0; i < json['record']['encounters'].length; i++){
        let encounter = []
        for (let j = 0; j < json['record']['encounters'][i]['observations'].length; j++){
          if ((json['record']['encounters'][i]['observations'][j]["category"] == "vital-signs") || 
          (json['record']['encounters'][i]['observations'][j]["category"] == "laboratory")){
            if (json['record']['encounters'][i]['observations'][j]['observations'].length === 0){
              let test = {}
              test.name = json['record']['encounters'][i]['observations'][j]['codes'][0]["display"]
              test.value = json['record']['encounters'][i]['observations'][j]['value']
              test.unit = json['record']['encounters'][i]['observations'][j]['unit']
              test.date = json['record']['encounters'][i]['observations'][j]['start']
              encounter.push(test)
            }
            else{
              for (let k = 0; k < json['record']['encounters'][i]['observations'][j]['observations'].length; k++){
                let test = {}
                test.name = json['record']['encounters'][i]['observations'][j]['observations'][k]['codes'][0]['display']
                test.value = json['record']['encounters'][i]['observations'][j]['observations'][k]['value']
                test.unit = json['record']['encounters'][i]['observations'][j]['observations'][k]['unit']
                test.date = json['record']['encounters'][i]['observations'][j]['observations'][k]['start']
                encounter.push(test)
              }
            }
          }
        }
        testsBuilder.push(encounter)
      }
      
      console.log(testsBuilder)
      setTests(testsBuilder.reverse())
    } catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log('error', err);
    }
  }

  useEffect(() => {
    loadImmunization()
    loadConditions()
    loadCareplans()
    loadInjuries()
    loadMedications()
    loadTests()
  }, [props.history])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleImmunizationChange = (newValue) => {
    setIm(newValue.target.value);
  };

  const handleConditionChange = (newValue) => {
    setCondition(newValue.target.value);
  };

  const loadTimelineImmunization = () => {
    let timeline = []
    for (let i = 0; i < immunizations.length; i++){
      if (Object.keys(immunizations[i]) == im){
        console.log(immunizations[i][im])
        for (let j = 0; j < immunizations[i][im].length; j++)
        {
          var d = new Date(immunizations[i][im][j])
          var dd = String(d.getDate()).padStart(2, '0');
          var mm = String(d.getMonth() + 1).padStart(2, '0');
          var yyyy = d.getFullYear();
  
          let date = dd + '/' + mm + '/' + yyyy;
          timeline.push(date)
        }
      }
    }
    setTimelineIm(timeline.reverse())
  }

  function onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }
  

  const loadCondition = () => {
    let code = ""
    for (let i = 0; i < conditions.length; i++){
      if (conditions[i]['name'] == condition){
        let index = 0;
        for (var key of Object.keys(conditions[i]['code'])){
          if (onlyNumbers(key)){
            if (index == 0){
              code += conditions[i]['code'][key]['display']
            }
            else{
              code += ", " + conditions[i]['code'][key]['display']
            }
          }
          index++;
        }
        setConditionCodes(code)
        setConditionStart(conditions[i]['start'])
        setConditionStop(conditions[i]['stop'])
      }
    }
  }

  useEffect(() => {
    loadTimelineImmunization()
  }, [im])

  useEffect(() => {
    loadCondition()
  }, [condition])

  const getImmunizationTimelines = () => {
    return timelineIm.map((tim, i) => {
      const color = i % 2 === 0 ? "success" : "secondary";
      return (
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color={color}/>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{tim}</TimelineContent>
        </TimelineItem>
      );
    });
  };

  const getCareplanTimelines = () => {
    let careplansString = ""
    let reasons = ""
    let activities = ""
    return careplans.map((careplan, i) => {
      const color = i % 2 === 0 ? "success" : "secondary";
      console.log(careplan)
      for (let i = 0; i < careplan['codes'].length; i++){
        if (i === 0){
          careplansString += careplan['codes'][i]['display']
        }
        else{
          careplansString += ", " + careplan['codes'][i]['display']
        }
      }
      for (let i = 0; i < careplan['reasons'].length; i++){
        if (i === 0){
          reasons += careplan['reasons'][i]['display']
        }
        else{
          reasons += ", " + careplan['reasons'][i]['display']
        }
      }
      for (let i = 0; i < careplan['activities'].length; i++){
        if (i === 0){
          activities += careplan['activities'][i]['display']
        }
        else{
          activities += ", " + careplan['activities'][i]['display']
        }
      }
      return (
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color={color}/>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper>
              <Typography>{careplansString}</Typography>
              <Typography sx={{marginTop: "20px"}}>Reasons: {reasons}</Typography>
              <Typography sx={{marginTop: "20px"}}>Activities: {activities}</Typography>
              <Typography sx={{marginTop: "20px"}}>Start date: {getDate(careplan['start'])}</Typography>
              <Typography sx={{marginTop: "20px"}}>End date: {getDate(careplan['stop'])}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      );
    });
  };

  const getInjuriesTimeline = () => {
    let injuriesString = ""

    return injuries.map((injury, i) => {
      const color = i % 2 === 0 ? "success" : "secondary";
      for (let i = 0; i < injury['codes'].length; i++){
        if (i === 0){
          injuriesString += injury['codes'][i]['display']
        }
        else{
          injuriesString += ", " + injury['codes'][i]['display']
        }
      }
      
      return (
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color={color}/>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper>
              <Typography>{injuriesString}</Typography>
              <Typography sx={{marginTop: "20px"}}>Start date: {getDate(injury['start'])}</Typography>
              <Typography sx={{marginTop: "20px"}}>End date: {getDate(injury['stop'])}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      );
    });
  };

  const getMedicationTimeline = () => {
    let medicationString = ""
    let reasons = ""
    let stopReasons = ""
    return medications.map((medication, i) => {
      const color = i % 2 === 0 ? "success" : "secondary";
      console.log(medication)
      for (let i = 0; i < medication['codes'].length; i++){
        if (i === 0){
          medicationString += medication['codes'][i]['display']
        }
        else{
          medicationString += ", " + medication['codes'][i]['display']
        }
      }
      for (let i = 0; i < medication['reasons'].length; i++){
        if (i === 0){
          reasons += medication['reasons'][i]['display']
        }
        else{
          reasons += ", " + medication['reasons'][i]['display']
        }
      }
      stopReasons =  medication['stopReason']['display']
      
      return (
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color={color}/>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper>
              <Typography>{medicationString}</Typography>
              <Typography sx={{marginTop: "20px"}}>Reasons: {reasons}</Typography>
              <Typography sx={{marginTop: "20px"}}>Stop reason: {stopReasons}</Typography>
              <Typography sx={{marginTop: "20px"}}>Start date: {getDate(medication['start'])}</Typography>
              <Typography sx={{marginTop: "20px"}}>End date: {getDate(medication['stop'])}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      );
    });
  };

  const getTestsTimeline = () => {
    let medicationString = ""
    let reasons = ""
    let stopReasons = ""
    return tests.map((test, i) => {
      const color = i % 2 === 0 ? "success" : "secondary";
      console.log(test)
      if (test.length != 0){
        return (
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={color}/>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper>
              <Typography>Date: {getDate(test[0]['date'])}</Typography>
                {test.map((singleTest, j) => {
                  return(<Typography sx={{mt: "10px"}}>{singleTest['name']}: value = {singleTest['value']}{singleTest['unit']}</Typography>);
                })}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      }
    });
  };

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Immunizations
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div style={{display: 'inline-block', width: "80%"}}>
          <div style={{float: "left"}}>
            <FormControl fullWidth sx={{ minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Immunization</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={im}
              label="Immunization"
              defaultValue=''
              onChange={handleImmunizationChange}
            >
              {immunizations.map((immunization) => (
              <MenuItem key={Object.keys(immunization)[0]} value = {Object.keys(immunization)[0]}>
                {Object.keys(immunization)[0]}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>
          <div style={{float: "right", width: "50%"}}>
          <Timeline position="alternate">
          {getImmunizationTimelines()}
        </Timeline>
          </div>
        </div>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{marginTop: "15px"}} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Conditions</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div style={{display: 'inline-block', width: "80%"}}>
          <div style={{float: "left"}}>
            <FormControl fullWidth sx={{ minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Conditions</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={condition}
              label="Conditions"
              defaultValue=''
              onChange={handleConditionChange}
            >
              {conditions.map((condition) => (
              <MenuItem key={condition['name']} value = {condition['name']}>
                {(condition['name'])}
              </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography sx={{marginTop: "10px"}}>Condition: {conditionCodes}</Typography>
          </div>
          <div style={{float: "right", width: "50%"}}>
          <Timeline position="alternate">
          <TimelineItem >
          <TimelineOppositeContent >
            Stop
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="secondary"/>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{conditionStop}</TimelineContent>
        </TimelineItem>
        <TimelineItem >
          <TimelineOppositeContent >
            {conditionStart}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="success"/>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Start</TimelineContent>
        </TimelineItem>
        </Timeline>
          </div>
        </div>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{marginTop: "15px"}} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Careplans
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Timeline position="alternate">
          {getCareplanTimelines()}
        </Timeline>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{marginTop: "15px"}} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Injuries</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Timeline position="alternate">
          {getInjuriesTimeline()}
        </Timeline>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{marginTop: "15px"}} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Medications</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Timeline position="alternate">
          {getMedicationTimeline()}
        </Timeline>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{marginTop: "15px"}} expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6bh-content"
          id="panel6bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Laboratory tests</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Timeline position="alternate">
          {getTestsTimeline()}
        </Timeline>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
