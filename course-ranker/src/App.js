import './App.css';
import firebaseApp from "./firebase";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";

function App() {

    const a_weight = 0.2
    const q_weight = 0.7
    const pass_weight = 0.5
    const gpa_weight = 0.75
    const num_taught_weight = 0.15
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
            let prof_score = prof_a + prof_q + prof_pass + prof_gpa + prof_num_taught
            prof_scores.set(key, prof_score)
        })

        console.log(prof_scores)

    }

      async function getMatchingDocs() {
          const db = getFirestore(firebaseApp);
          const q = query(collection(db, "courses"), where("course", "==", 411));
          const querySnapshot = await getDocs(q);
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
