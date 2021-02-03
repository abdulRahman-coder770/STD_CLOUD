import React, {useState, useEffect, useContext} from 'react';
import ReactDOM from 'react-dom';
import '../app.css'
import logo from "./images/logo_v1.png";
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

export default function emailConfirmation() {

    if (localStorage.getItem('email_verified_at')){
        return <Redirect to='/roles'/>
    }

    return (
        <div className="container" id='registerForm'>

            <div className="row justify-content-center">



               <div>
                   <div className="card">

                       <div className="card-header">
                           <h2 className={'text-light'}>Email Confirmation</h2>

                       </div>
                       <div className="card-body">
                           <h3 className='text-primary'>
                               Hi {localStorage.getItem('username')}!
                           </h3>
                           <h5 className='text-primary'>
                               we send you a verification link on to complete your registration, please click it!
                           </h5>
                       </div>

                   </div>
               </div>

            </div>
        </div>
    );
}
