// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASQaHwzleKsSwlCAwirta2ccc6YxBsED8",
  authDomain: "lifesapp-502b4.firebaseapp.com",
  projectId: "lifesapp-502b4",
  storageBucket: "lifesapp-502b4.appspot.com",
  messagingSenderId: "497753431721",
  appId: "1:497753431721:web:5d8569285010cea91e53b8",
  measurementId: "G-BSFXRRDPXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);