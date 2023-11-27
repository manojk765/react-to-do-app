import './App.css';
import React , {useEffect, useState} from 'react' ;
import {db} from "./firebase" ;
import {collection , addDoc,deleteDoc,doc,query,getDocs,where,updateDoc} from "firebase/firestore" ;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' ;

function App() {
  const [todo , setTodo] = useState([]);
  const [input , setInput] = useState("");

  // Rendering Data From FireBase
  
 async function fetchdata(){
      console.log("working")
      const querySnapshot = await getDocs(collection(db, "todo"));
      let arr = []
      querySnapshot.forEach((doc) => {
        arr.push({...doc.data()})
      });
      setTodo(arr)
  };
 
  useEffect(()=>{ fetchdata(); },[])

  // For taking input of tasks
  const addToDo= () =>{
    console.log(todo)
    if(document.querySelector('#add_btn').innerHTML = " EDIT "){
      document.querySelector('#add_btn').innerHTML = " ADD ";
    }
    if(input !== ""){
      setTodo([...todo, { input: input, isCompleted: false }]);
      setInput("");
      // Adding to Firebase
      addDoc(collection(db,"todo"),{
        input , isCompleted: false ,
      })
      }else{
        alert("Empty Task cannot be added");
      }
  }

  // Marking as read

  async function markasread(index) {
    const newTodos = [...todo];
    if(newTodos[index].isCompleted == false){
      newTodos[index].isCompleted = true; 
      var data = {
        "isCompleted": true
      }
    }
    else{
      newTodos[index].isCompleted = false ;
      var data = {
        "isCompleted": false
      }
    }

    setTodo(newTodos);

    const q = query(collection(db, "todo"), where("input","==",`${todo[index].input}`));
    const querySnapshot = await getDocs(q);

    let id = ""

    querySnapshot.forEach((doc) => {
      id=doc.id
    });
   
    const docRef = doc(db, "todo", id);

    updateDoc(docRef, data) 
  }
  
  // Deleting

  async function remove(index){
    const newTodos = [...todo];
    const deleted_item = newTodos.splice(index, 1);

    // Deleting from Firebase
    const q = query(collection(db, "todo"), where("input","==",`${deleted_item[0].input}`));
    const querySnapshot = await getDocs(q);

    
    let id = ""
  
    querySnapshot.forEach((doc) => {
      id=doc.id
    });
    const docref = doc(db,"todo",id);
    deleteDoc(docref);

    setTodo(newTodos);
  };

  // Editing

  async function edit(index){
    const newTodos = [...todo];
    if(newTodos[index].isCompleted == true){
      alert("Task is already completed");
      return ;
    }
    else{
      const edit_item = newTodos.splice(index, 1); 

      // Deleting from Firebase
      const q = query(collection(db, "todo"), where("input","==",`${edit_item[0].input}`));
      const querySnapshot = await getDocs(q);
      
      let id = ""
    
      querySnapshot.forEach((doc) => {
        id=doc.id
      });
      const docref = doc(db,"todo",id);
      deleteDoc(docref);

      setTodo(newTodos);
      const val = edit_item[0].input;
      setInput(val) ;
  
      document.querySelector('#add_btn').innerHTML = "EDIT";
      document.querySelector('#input').focus() ;
    }
  };

  return (
    <div className="App">
      <h1>To do app</h1>
      
      <center>
      <div id='input_field'> 

      <input type="text" value={input} id="input" onChange={(event) => setInput(event.target.value)} placeholder="Add a Task..."/>

      <button class='btn' id="add_btn" onClick={addToDo}>ADD</button>

      </div>
      </center>

      <center>
      <div className='To-do-List'>
          { todo.map((entry , index) =>(
            <div key={index}  className= 'items' >

            <input type="checkbox" id='checkbox' onChange={() => markasread(index)} checked={entry.isCompleted ? true : false}/>

            <p className={entry.isCompleted ?'completed':'not-completed'}>{entry.input}</p>

            <div>
            <button className='btn' onClick={() => remove(index)} id='delete'>Delete</button>
            <button className='btn' onClick={() => edit(index)} id='edit'>Edit</button>
            </div>

            </div>
          ) 
          )
          }
      </div>
      </center>
      
    </div>
  );
}

export default App;
