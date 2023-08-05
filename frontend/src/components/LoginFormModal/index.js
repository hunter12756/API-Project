import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1 id='login-title'>Log In</h1>
      <form className='login-form' onSubmit={handleSubmit}>
      {errors.credential && (
          <p className="errors">{errors.credential}</p>
        )} <label> Username or Email</label>
        <div id ='user-input'>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <label>Password</label>
        <div id="password-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='login-btn-container'>
          <button disabled={credential.length <4 || password.length < 6} id='real-login-btn' type="submit">Log In</button>
        </div>
      </form>

      <div className="demo-user-container">
        <button
          id='demo-login'
          onClick={() => {
            dispatch(sessionActions.login({
              credential: 'Demo-lition', password: 'password'
            })).then(closeModal)
          }}
        >
          Log in as Demo User
        </button>
      </div>
    </>
  );
}

export default LoginFormModal;
