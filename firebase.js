export const firebaseConfig = {
    apiKey: "AIzaSyCHmWoqAkE73DhbELK-BfPYLMaJNAbz7tE",
    authDomain: "file-upload-d8004.firebaseapp.com",
    projectId: "file-upload-d8004",
    storageBucket: "file-upload-d8004.appspot.com",
    messagingSenderId: "1047788348281",
    appId: "1:1047788348281:web:efb379d316de7fa96cc5a8"
};
  
  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';


let docName = "file-upload";

export {docName,initializeApp,getFirestore,getCountFromServer, collection, query, where, getDocs,getDoc, setDoc, addDoc, doc,deleteDoc,onSnapshot,orderBy, limit,startAt, startAfter,endAt};

