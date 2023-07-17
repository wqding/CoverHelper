import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signInWithPopup, signOut } from 'firebase/auth';
import { set, ref, onValue } from "firebase/database";
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
  const [promptSignUp, setPromptSignUp] = useState(false)
  
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

  const logInAnonymously = async () => {
    await signInAnonymously(auth).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(user);

      // add an anoymous user to the database with 200 tokens
      // Can then later remove accounts that don't have firstname/lastname entires
      set(ref(database, `users/${user.uid}`), {
        tokens: 200,
      });

      navigate('/app', { replace: true });
    })
  }

  // will need to refactor this to the dashboard app page
  const decreaseTokens = async (tokenAmount) => {
    if (currentUser) {
      const updatedTokens = currentUserData.tokens - tokenAmount
      set(ref(database, `users/${currentUser.uid}/tokens`), updatedTokens)
        .then(() => {
          // data was updated. udpate the currentUserData
        })
        .catch((err) => {
          // console.log(err)
        })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      // update with user data
      // console.log(user)
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
    promptSignUp,
    setPromptSignUp,
    decreaseTokens,
    getUser,
    getSignInMethodsForEmail,
    login,
    logInAnonymously,
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