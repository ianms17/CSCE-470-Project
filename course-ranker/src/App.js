
import './App.css';
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
          course_list.push(doc.data());
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
