import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './components/home';
import Login from './components/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Authentication logic goes here
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/home">
          {isAuthenticated ? <HomePage /> : <Redirect to="/login" />}
        </Route>
        <Redirect from="/" to={isAuthenticated ? "/home" : "/login"} />
      </Switch>
    </Router>
  );
}

export default App;


