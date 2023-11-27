import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore" ;


const firebaseConfig = {
  apiKey: "AIzaSyBuFWfdJtNbAm8D3dwk9wZdy1-oiO7dgo8",
  authDomain: "to-do-app-2f899.firebaseapp.com",
  projectId: "to-do-app-2f899",
  storageBucket: "to-do-app-2f899.appspot.com",
  messagingSenderId: "510778467568",
  appId: "1:510778467568:web:492903839cfdcaef800e35",
  measurementId: "G-0DMYWG52PQ"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app) ;

export{db} ;