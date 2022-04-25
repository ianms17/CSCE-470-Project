import React, { useState } from 'react';
import './App.css';
import firebaseApp from "./firebase";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";

function App() {
    const [prof_results, setProfResults] = useState([])
    const [value, setValue] = useState("");

    const a_weight = 0.2
    const q_weight = 0.7
    const pass_weight = 0.5
    const gpa_weight = 0.75
    const num_taught_weight = 0.005
    let course_list = [];
    let prof_scores = new Map();

    function rank() {
        const prof_a_rate = new Map();
        const prof_q_rate = new Map();
        const prof_pass_rate = new Map();
        const prof_avg_gpa =  new Map();
        const num_times_taught =  new Map();

        // loop through all courses and update maps
        // all maps are
        course_list.forEach((item) => {
            if(prof_a_rate.has(item.prof)) {
                prof_a_rate.set(item.prof, (prof_a_rate.get(item.prof) + (item.a / item.finished)))
                prof_q_rate.set(item.prof, (prof_q_rate.get(item.prof) + (item.q / item.enrolled)))
                prof_avg_gpa.set(item.prof, (prof_avg_gpa.get(item.prof) + item.gpa))
                prof_pass_rate.set(item.prof, (prof_pass_rate.get(item.prof) + ((item.a + item.b + item.c +item.d) / item.finished)))
                num_times_taught.set(item.prof, num_times_taught.get(item.prof) + 1)
            } else {
                prof_a_rate.set(item.prof, (item.a / item.finished))
                prof_q_rate.set(item.prof, (item.q / item.enrolled))
                prof_avg_gpa.set(item.prof, (item.gpa))
                prof_pass_rate.set(item.prof, ((item.a + item.b + item.c +item.d) / item.finished))
                num_times_taught.set(item.prof, 1)
            }
        })

        prof_a_rate.forEach((value,key) => {
            prof_a_rate.set(key, (value / num_times_taught.get(key)))
            prof_q_rate.set(key, (prof_q_rate.get(key) / num_times_taught.get(key)))
            prof_avg_gpa.set(key, (prof_avg_gpa.get(key) / num_times_taught.get(key)))
            prof_pass_rate.set(key, (prof_pass_rate.get(key) / num_times_taught.get(key)))
        })

        prof_a_rate.forEach((value, key) => {
            let prof_a = prof_a_rate.get(key) * a_weight
            let prof_q = prof_q_rate.get(key) * q_weight
            let prof_pass = prof_pass_rate.get(key) * pass_weight
            let prof_gpa = prof_avg_gpa.get(key) * gpa_weight
            let prof_num_taught = num_times_taught.get(key) * num_taught_weight
            let prof_score = prof_a + prof_pass + prof_gpa + prof_num_taught - prof_q
            prof_scores.set(key, prof_score)
        })
        let sorted_prof_scores = new Map([...prof_scores.entries()].sort((a, b) => b[1] - a[1]))
        let arr = Array.from(sorted_prof_scores)
        setProfResults(arr)
    }

    async function getMatchingDocs(course) {
        const db = getFirestore(firebaseApp);
        const q = query(collection(db, "courses"), where("course", "==", parseInt(course)));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            course_list.push(doc.data());
        });
        rank();
    }

    console.log(prof_results)
    console.log(value)

    return (
        <div>
             <Box sx={{ flexGrow: 1 }}>
                 <AppBar position="static" sx={{ bgcolor: "maroon" }}>
                    <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CSCE Course Ranker
                    </Typography>
                    </Toolbar>
                </AppBar>

            </Box>
            <Box sx={{marginTop: "2%", display:"flex", justifyContent:"center"}}>
                <label>CSCE Course Number:</label>
            </Box>
                <Box sx={{marginTop: "2%", display:"flex", justifyContent:"center"}}>
                <TextField id="standard-basic" label="Enter Course #" variant="standard"  value={value} onChange={(e) => setValue(e.target.value)} />
                <Button variant="contained" sx={{ bgcolor: "maroon",  ':hover': {bgcolor: '#808080'}}} onClick={() => {
                    getMatchingDocs(value);
                }}>Submit</Button>
            </Box>
            <Box sx={{ display:"flex", justifyContent:"center", marginTop: "2%", textAlign: "center"}}>
                <table style={{borderRadius:"5px", fontSize:"18px", borderCollapse:"collapse", width:"80%",
                    whiteSpace:"nowrap", backgroundColor:"lightgray"}}>
                    <thead>
                    <tr>
                        <th style={{ width:"50%", border:"1px solid black", backgroundColor:"rgba(128,0,0,1)",
                            color:"#ffffff" }}>Professor</th>
                        <th style={{ width:"50%", border:"1px solid black", backgroundColor:"rgba(128,0,0,1)",
                            color:"#ffffff" }}>Rating</th>
                    </tr>
                    </thead>
                    <tbody style={{ borderBottom:"1px solid #d8d8d8" }}>
                    {prof_results.map((item, index) => {
                        return (
                        <tr>
                            <td style={{ borderRight:"1px solid #d8d8d8",
                                borderLeft:"1px solid #d8d8d8" }} key={item[0]}>{item[0]}</td>
                            <td style={{ borderRight:"1px solid #d8d8d8",
                                borderLeft:"1px solid #d8d8d8" }} key={item[1]}>{item[1]}</td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </Box>
        </div>
    );
}

export default App;
