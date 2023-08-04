import React from 'react';
import { NavLink,Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  let navLinks;
  if (sessionUser) {
    navLinks = (
      <div className='icon-new-group'>
        <div className='new-group'>
          <Link to={'/groups/create'}>Start a new group</Link>
        </div>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    navLinks = (
      <div className='loginSignup'>
        <OpenModalMenuItem
          itemText="Log In"
          modalComponent={<LoginFormModal/>} />

        <OpenModalMenuItem
          itemText="Sign Up"
          modalComponent={<SignupFormModal/>} />

      </div>
    )
  }
  return (
    <nav className='navbar'>
      <NavLink exact to="/">Game Up</NavLink>

      {isLoaded && navLinks}
    </nav>
  );
}

export default Navigation;
