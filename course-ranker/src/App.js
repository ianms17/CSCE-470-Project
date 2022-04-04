// import logo from './logo.svg';
import './App.css';
// import firebase from "./firebase";
import { Course } from "./course";
import firebaseApp from "./firebase";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
// import {initializeApp} from "firebase/app";

function App() {

  async function getMatchingDocs() {

      const db = getFirestore(firebaseApp);
      console.log('db')
      const q = query(collection(db, "courses"), where("course", "==", 411));
      console.log('q')
      const querySnapshot = await getDocs(q);
      console.log('query')

      let course_list = [];
      querySnapshot.forEach((doc) => {
          let course = new Course(
              doc.data().department,
              doc.data().course,
              doc.data().year,
              doc.data().semester,
              doc.data().prof,
              doc.data().gpa,
              doc.data().section,
              doc.data().a,
              doc.data().b,
              doc.data().c,
              doc.data().d,
              doc.data().f,
              doc.data().q,
              doc.data().finished,
              doc.data().enrolled
          );
          course_list.push(course);
      });
      return course_list;
  }

  // Core ranking algorithm
  console.log(getMatchingDocs());


  return (
    <div className="App">
        <h1> Firebase Test </h1>
    </div>
  );
}

export default App;
