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

export default function confirmEmail() {
    const [logged, setLogged] = useState(localStorage.getItem('logged'))
    if (logged === '1') {
        // setLoading(false)
        return <Redirect to='/roles'/>
    }

    if (!localStorage.getItem('username') || !localStorage.getItem('email') || !localStorage.getItem('password')){
        return <Redirect to='/register'/>
    }
    let name=localStorage.getItem('username')
    let email=localStorage.getItem('email')
    let password=localStorage.getItem('password')

    function setVerified(id){
        axios.post("http://localhost:8000/api/auth/emailVerified", {
            'id':id
        }).then((res)=>{

            if (res.data.status==1){
                setLogged(localStorage.getItem('logged'))
            }
        })
    }
    if (localStorage.getItem('email_verified_at')){
        return <Redirect to='/roles'/>
    }

    function loginHandler() {

            axios.post("http://localhost:8000/api/auth/login", {
                "email": email,
                "password": password
            })
                .then((res) => {


                        console.log(res.data.user);
                        localStorage.setItem('token', res.data.access_token);
                        localStorage.setItem('username', res.data.user.name);
                        localStorage.setItem('userId', res.data.user.id);
                        localStorage.setItem('uni_id', res.data.user.university_id);
                        localStorage.setItem('major_id', res.data.user.major_id);
                        localStorage.setItem('major_name', res.data.major);
                        localStorage.setItem('uni_name', res.data.uni);
                        localStorage.setItem('role_id', res.data.user.role_id);
                        localStorage.setItem('photo_path', res.data.user.photo_path);
                        localStorage.setItem('status', res.data.user.status);
                        localStorage.setItem('is_active', res.data.user.is_active);
                        localStorage.setItem('email_verified_at', res.data.user.email_verified_at);
                        localStorage.setItem('logged', JSON.stringify(1));
                        setVerified(res.data.user.id)

                });

    }
    loginHandler();

    return (
        <div className="container" id='registerForm'>

            <div className="row justify-content-center">
                <div className="card">
                    <div className="card-header">
                        <h3>
                            Hi {localStorage.getItem('username')}!
                        </h3>
                    </div>
                    <div className="card-body">

                        <h5 className='text-primary'>
                            Email confirmed done
                        </h5>
                    </div>

                </div>

            </div>
        </div>
    );
}
