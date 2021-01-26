import React, {useState, useContext} from 'react'
import '../app.css'
import {AuthContext} from '../auth-context'
import Home from "./student/Home";
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import MainApp from "../MainApp";
import logo from "./images/logo_v1.png";

export default function Login() {


    const auth = useContext(AuthContext);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [logged, setLogged] = useState(localStorage.getItem('logged'))
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')


    if (logged === '1') {
        // setLoading(false)
        return <Redirect to='/roles'/>
    }

    function loginHandler(e) {
        e.preventDefault();
        setLoading(true)
        if (email === '' || password === '') {
            setErr('email or password can not be empty')
            setLoading(false)
        } else {
            axios.post("http://localhost:8000/api/auth/login", {
                "email": email,
                "password": password
            })
                .then((res) => {
                    if (res.data.status === 0) {
                        setErr('please enter correct email and password')
                        setLoading(false)
                    } else {

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
                        localStorage.setItem('logged', JSON.stringify(1));
                        auth.setUserID(res.data.user.id);
                        auth.setRoleID(res.data.user.role.id);
                        auth.setUniID(res.data.user.university_id);
                        auth.setToken(res.data.access_token);
                        auth.setMajorID(res.data.user.major_id)
                        auth.login();
                        setLoading(false)
                        setLogged(localStorage.getItem('logged'))
                    }
                });


        }
    }

    return (
        <div className="container-fluid " id='loginForm' style={{'width':'100%','backgroundColor':'rgb(142, 85, 142)'}}>
            <div className="row justify-content-center">

                <div className="justify-content-center">


                    <div className="form-login card">
                        <div className='card-header' style={{'width':'100%','backgroundColor':'rgb(142, 85, 142)'}}>

                            <h2 className='text-center' style={{'color':'#fff'}}>
                                <img src={logo} alt=""/>
                                Go to your Cloud</h2>
                        </div>
                        <br/>
                        <h4 style={{'color':'rgb(142, 85, 142)'}}>Login</h4>
                        <form action="" onSubmit={loginHandler}>
                            <br/>
                            <input disabled={loading} onChange={(e) => {
                                setEmail(e.target.value)
                            }} type="text" id="Email" className="form-control input-sm chat-input" placeholder="email"

                            />
                            <br/>
                            <br/>
                            <input disabled={loading}
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                   }}
                                   type="Password" id="userPassword" className="form-control input-sm chat-input"
                                   placeholder="password"/>

                            <br/><br/>
                            <div className="wrapper">
                        <span className="group-btn">
                        <button style={{'backgroundColor':'rgba(142, 85, 142,1)'}}
                            type='submit' disabled={loading} className="btn btn-secondary btn-block">{loading ?
                            <span>logging....</span>
                            : <span>Login</span>} <i className="fa fa-sign-in"/></button>
                        </span>
                                <p style={{color: 'red'}}>{err}</p>
                                <hr/>
                                <p className='text-primary' >Don't have an Account?
                                    <a style={{'paddingLeft':'2px'}} href='/register'> <u>Signup</u></a></p>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    )
}
