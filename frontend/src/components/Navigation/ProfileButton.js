import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id='profile-btn' onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user && (
          <>
            <li>Hello, {user.username}</li>
            <li> <NavLink id='link' to='/groups'>View all groups</NavLink></li>
            <li> <NavLink id='link' to='/events'>View all events</NavLink></li>
            <li>Name: {user.firstName} {user.lastName}</li>
            <li id='email'>Email: {user.email}</li>
            <li id='logout-btn-container'>
              <button id='logout-btn' onClick={logout}>Log Out</button>
            </li>
          </>
        ) }
      </ul>
    </>
  );
}

export default ProfileButton;
