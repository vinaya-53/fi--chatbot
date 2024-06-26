import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { googleprovider } from '../config/firebase-config'; // Adjust import as per your setup
import { auth } from '../config/firebase-config'; // Adjust import as per your setup
import './auth.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const history = useHistory();

  // Example function to check if the pop-up is closed
  const checkPopupClosed = () => {
    if (!popup || popup.closed) {
      console.log('Pop-up window is closed or blocked.');
      // Handle pop-up closed event here
    } else {
      console.log('Pop-up window is still open.');
      // Continue handling open pop-up window
    }
  };
  useEffect(() => {
    const interval = setInterval(checkPopupClosed, 1000);
    return () => clearInterval(interval);
  }, [popup]);
  // Function to handle sign-in with email and password
  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully logged in');
      onLogin();
      history.push('/home');
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Display error message to the user
      // Example: setErrorMessage(error.message);
    }
  };

  // Function to handle sign-up with email and password
  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed up');
      history.push('./'); // Adjust the path as needed
    } catch (error) {
      console.error('Error signing up:', error.message);
      // Display error message to the user
      // Example: setErrorMessage(error.message);
    }
  };

  // Function to handle sign-in with Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleprovider); // Adjust provider as per your setup
      console.log('Successfully signed in with Google');
      onLogin();
      history.push('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      // Display error message to the user
      // Example: setErrorMessage(error.message);
    }
  };

  // Function to handle login or sign-up based on mode
  const handleAuthAction = () => {
    if (isSignUp) {
      signUp();
    } else {
      signIn();
    }
  };

  // Function to toggle between sign-up and login modes
  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
  };
  return (
    <div className="login-container">
       <div className="welcome-message">
        <h1>Welcome to Fi-chatbot</h1>
        <h3>- ask anything related to company stocks and loans</h3> 
      </div>
      <div className="login-form">
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
  
        <button onClick={handleAuthAction}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>
        <p>
          {isSignUp
            ? 'Already have an account?'
            : 'Don\'t have an account yet?'}
          <button onClick={toggleAuthMode}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </p>
      </div>
     
    </div>
  );
}

export default Login;
