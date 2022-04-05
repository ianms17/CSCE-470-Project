import logo from './logo.svg';
import './App.css';
import firebase from "./firebase";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import * as React from 'react';

function App() {
  const firebaseApp = firebase.apps[0];
  const [coursenum, setCoursenum] = React.useState('');
 
  const columns = [
    { 
      field: 'id', 
      headerName: 'Course', 
      width: 70 
    },
    {
      field: 'year',
      headerName: 'Year',
      width: 60,
      editable: false,
    },
    {
      field: 'semester',
      headerName: 'Semester',
      width: 90,
      editable: false,
    },
    {
      field: 'prof',
      headerName: 'Professor',
      width: 160,
    },
    {
      field: 'gpa',
      headerName: 'GPA',
      type: 'number',
      width: 60,
      editable: false,
    },
    {
      field: 'section',
      headerName: 'Section',
      width: 70,
    },
    {
      field: 'a',
      headerName: 'A',
      width: 40,
    },
    {
      field: 'b',
      headerName: 'B',
      width: 40,
    },
    {
      field: 'c',
      headerName: 'C',
      width: 40,
    },
    {
      field: 'd',
      headerName: 'D',
      width: 40,
    },
    {
      field: 'F',
      headername: 'F',
      width: 40
    },
    {
      field: 'Q',
      headername: 'Q',
      width: 40,
    },
    {
      field: 'Finished',
      headername: 'Total Finished',
      width: 90
    },
    {
      field: 'Enrolled',
      headername: 'Total Enrolled',
      width: 90
    }
  ];
  
  const rows = [
    { id: 1, year: null, semester: null, prof: null, gpa: null, section: null, a: null, b: null, c: null, d: null, F: null, Enrolled: null, Finished: null},
  ];
  
  const handleChange = (event: SelectChangeEvent) => {
    setCoursenum(event.target.value);
  };

  return (
    <div className="App">
        <h1> Firebase Test </h1>
        <Box>
          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id="course-selector-label">Course</InputLabel>
            <Select
              labelId="course-selector-label"
              id="course-selector"
              value={coursenum}
              label="Course"
              autoWidth
              onChange={handleChange}
            >
              <MenuItem value={402}>CSCE402</MenuItem>
              <MenuItem value={410}>CSCE410</MenuItem>
              <MenuItem value={411}>CSCE411</MenuItem>
              <MenuItem value={420}>CSCE420</MenuItem>
              <MenuItem value={421}>CSCE421</MenuItem>
              <MenuItem value={430}>CSCE430</MenuItem>
              <MenuItem value={431}>CSCE431</MenuItem>
              <MenuItem value={434}>CSCE434</MenuItem>
              <MenuItem value={435}>CSCE435</MenuItem>
              <MenuItem value={436}>CSCE436</MenuItem>
              <MenuItem value={438}>CSCE438</MenuItem>
              <MenuItem value={440}>CSCE440</MenuItem>
              <MenuItem value={441}>CSCE441</MenuItem>
              <MenuItem value={443}>CSCE443</MenuItem>
              <MenuItem value={445}>CSCE445</MenuItem>
              <MenuItem value={447}>CSCE447</MenuItem>
              <MenuItem value={451}>CSCE451</MenuItem>
              <MenuItem value={452}>CSCE452</MenuItem>
              <MenuItem value={461}>CSCE461</MenuItem>
              <MenuItem value={462}>CSCE462</MenuItem>
              <MenuItem value={463}>CSCE463</MenuItem>
              <MenuItem value={464}>CSCE464</MenuItem>
              <MenuItem value={465}>CSCE465</MenuItem>
              <MenuItem value={469}>CSCE469</MenuItem>
              <MenuItem value={470}>CSCE470</MenuItem>
              <MenuItem value={481}>CSCE481</MenuItem>
              <MenuItem value={482}>CSCE482</MenuItem>
              <MenuItem value={483}>CSCE483</MenuItem>
              <MenuItem value={489}>CSCE489</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          />
        </div>
        <code>
          <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
        </code>
    </div>
  );
}


export default App;
