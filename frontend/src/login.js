import React from "react";
import {Link } from 'react-router-dom';

function Log() {
    return (
        <>
        <h1>Log In</h1>
      <form>
        <label>Email: <input type="email" /></label>
        <label>Password: <input type="password" /></label>
         <Link to="/main">Login</Link>
         <Link to="/sign">Sign Up</Link>




      </form>
      </>
    );
  }
  export default Log;