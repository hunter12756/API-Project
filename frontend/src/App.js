import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage"
import {Route} from 'react-router-dom';
import Groups from './components/Groups'
import Events from './components/Events'
import GroupDetail from "./components/Groups/GroupDetail";
import EventDetail from './components/Events/EventDetail'
import GroupForm from './components/Groups/GroupForm'
import UpdateGroup from "./components/Groups/UpdateGroup";
import EventForm from './components/Events/EventForm'

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
          <Route exact path ='/groups/create'>
            <GroupForm/>
          </Route>
          <Route exact path='/groups/:groupId/events/create'>
            <EventForm/>
          </Route>
          <Route exact path ='/groups/:groupId'>
            <GroupDetail/>
          </Route>
          <Route exact path='/groups/:groupId/edit'>
            <UpdateGroup/>
          </Route>
          <Route path='/groups'>
            <Groups/>
          </Route>
          <Route path ='/events/:eventId'>
            <EventDetail/>
          </Route>
          <Route path ='/events'>
            <Events/>
          </Route>
        </Switch>}
    </>
  );
}

export default App;
