import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { set, ref, onValue} from "firebase/database";
import { auth, database } from '../services/firebase'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserData, setCurrentUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(user);
    })
  }
  
  const logout = async () => {
    await signOut(auth).then(() => {

    }).catch(() => {

    });
  }

  const register = async (email, password, firstName, lastName) => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user.uid;
  
        set(ref(database, `users/${user}`), {
          firstname: firstName,
          lastname: lastName,
          tokens: 2000,
        });

        navigate('/app', { replace: true });
    })
  }

  function getUser() {
    return auth.currentUser
  }

  // function isAdmin() {
  //   return auth.currentUser.getIdTokenResult()
  //   .then((idTokenResult) => {
  //     if (!!idTokenResult.claims.admin) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   })
  // }

  // function isEditor() { 
  // }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      // update with user data
      if (user) {
        const dbuser = ref(database, `users/${user.uid}`);
        onValue(dbuser, (snapshot) => {
          const data = snapshot.val();
          setCurrentUserData(data)
          setLoading(false)
        });
      } else {
        setCurrentUserData(null);
        setLoading(false)
      }
    });
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    currentUserData,
    getUser,
    login,
    logout,
    register,
  }

  return (
    <AuthContext.Provider value={value}>
      { !loading && children }
    </AuthContext.Provider>
  )
}