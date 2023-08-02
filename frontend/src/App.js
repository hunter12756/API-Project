import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage"
import {Route} from 'react-router-dom';
import Groups from './components/Groups'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />

      {isLoaded &&
        <Switch>
          <Route exact path='/'>
            <LandingPage/>
          </Route>
          <Route path='/groups'>
            <Groups/>
          </Route>
        </Switch>}
    </>
  );
}

export default App;
