
import './App.css';
import { Course } from "./course";
import firebaseApp from "./firebase";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
// import {initializeApp} from "firebase/app";

function App() {

const a_weight = 0.2
const q_weight = 0.7
const pass_weight = 0.5
const pa_weight = 0.75
const um_taught_weight = 0.15
let course_list = [];
let final_rank = [];

  function rank() {
   const prof_a_rate = new Map();
   const prof_q_rate = new Map();
   const prof_pass_rate = new Map();
   const prof_avg_gpa =  new Map();
   const num_times_taught =  new Map();
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


    console.log(prof_a_rate)
    console.log(prof_q_rate)
    console.log(prof_avg_gpa)
    console.log(prof_pass_rate)
    console.log(num_times_taught)

  }

  async function getMatchingDocs() {
      const db = getFirestore(firebaseApp);
      console.log('db')
      const q = query(collection(db, "courses"), where("course", "==", 411));
      console.log('q')
      const querySnapshot = await getDocs(q);
      console.log('query')
      querySnapshot.forEach((doc) => {
          course_list.push(doc.data());
      });
      rank();
  }

  getMatchingDocs();


  return (
    <div className="App">
        <h1> Firebase Test </h1>
    </div>
  );
}

export default App;
