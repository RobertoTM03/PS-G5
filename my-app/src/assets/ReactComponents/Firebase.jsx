import { createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCT6JOOpv3rXJjdjxDq-brPhb4OZhGGOco",
  authDomain: "ps-g5-2025.firebaseapp.com",
  projectId: "ps-g5-2025",
  storageBucket: "ps-g5-2025.firebasestorage.app",
  messagingSenderId: "304020958555",
  appId: "1:304020958555:web:514ea08ac0c29ad714fe7e",
  measurementId: "G-5FYVP03E17"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
    return (
      <FirebaseContext value={{ app, auth }}>
        {children}
      </FirebaseContext>
    );
  };

  export const useFirebase = () => useContext(FirebaseContext);