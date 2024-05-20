import React from "react";
import {Link } from 'react-router-dom';

function Sign() {
    return (
        <>
        <h1>Sign Up</h1>
      <form>
        <label>Email: <input type="email" /></label>
        <label>Password: <input type="password" /></label>
        <label>confirm  Password: <input type="password" /></label>
        <Link to="/main">Sign Up</Link>



      </form>
      </>
    );
  }
  export default Sign;