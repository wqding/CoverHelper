import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup, signOut } from 'firebase/auth';
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

  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider).then((res) => {
      // signed in
      const user = res.user;
      // add the user to the database if they don't exist yet
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);

        onValue(userRef, (snapshot) => {
          // snapshot does not exist, so make a new entry
          if (!snapshot.exists()) {
            const firstName = user.displayName
            const lastName = ''

            set(ref(database, `users/${user.uid}`), {
              firstname: firstName,
              lastname: lastName,
              tokens: 2000,
            });
          }

          navigate('/app', { replace: true });
        });
      }
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

  const getSignInMethodsForEmail = async (email) => {
    try {
      const res = await fetchSignInMethodsForEmail(auth, email);
      return res;
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }

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
    getSignInMethodsForEmail,
    login,
    loginWithGoogle,
    logout,
    register,
  }

  return (
    <AuthContext.Provider value={value}>
      { !loading && children }
    </AuthContext.Provider>
  )
}