import React, {useState, useEffect, useContext} from 'react';
import ReactDOM from 'react-dom';
import '../app.css'
import logo from "./images/logo_v1.png";
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route, Link
} from "react-router-dom";

export default function Register(props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Cpassword, setCpassword] = useState('');
    const [unis, setUnis] = useState([]);
    const [majors, setMajors] = useState([]);
    const [uni_id, setUni_id] = useState('');
    const [major_id, setMajor_id] = useState('');
    const [loading, setLoading] = useState(false);
    const [errEmail, setErrEmail] = useState('');
    const [err, setErr] = useState('');
    const [switching, setSwitching] = useState(false)

    async function register() {
        setLoading(true)
        if (uni_id === '' || major_id === '' || email === '' || password === '' || Cpassword === '' || name==='') {
            setErr('all fields required')
            setLoading(false)
        } else {
            await axios.post("http://127.0.0.1:8000/api/auth/register", {
                'university_id': uni_id,
                'major_id': major_id,
                'name': name,
                'email': email,
                'password': password,
                'password_confirmation': Cpassword,
            }).then((res) => {
                if (res.data.status===0){
                    setErr(res.data.error)
                    setLoading(false)

                }
                else {
                    console.log(res.data);
                    localStorage.setItem('username', res.data.name);
                    localStorage.setItem('email', res.data.email);
                    localStorage.setItem('password', res.data.password);
                    // localStorage.setItem('userId', res.data.user.id);
                    // localStorage.setItem('uni_id', res.data.user.university_id);
                    // localStorage.setItem('major_id', res.data.user.major_id);
                    // localStorage.setItem('major_name', res.data.major);
                    // localStorage.setItem('uni_name', res.data.uni);
                    // localStorage.setItem('role_id', res.data.user.role_id);
                    // localStorage.setItem('photo_path', res.data.user.photo_path);
                    // localStorage.setItem('status', res.data.user.status);
                    // localStorage.setItem('email_verified_at', res.data.user.email_verified_at);
                    // localStorage.setItem('is_active', res.data.user.is_active);
                    localStorage.setItem('logged', JSON.stringify(0));
                    setLoading(false)
                    setSwitching(true)

                }


            });
        }
    }
    // if (switching){
    //     return (<Redirect to='/confirm-email'/>)
    // }

    const submit = (event) => {
        event.preventDefault();
        register();
    }


    useEffect(() => {
            function getUnis() {
                axios.get("http://127.0.0.1:8000/api/getAllUnis")
                    .then((res) => {
                        console.log(res.data)
                        setUnis(res.data.unis)
                    })
            }

            getUnis()
        }
        , []);

    async function selectUni(t) {

        // console.log(uni_id);
        setMajor_id('')
        await axios.post("http://127.0.0.1:8000/api/getUniMajors", {
            'uni_id': t
        })
            .then((res) => {
                // console.log(res.data)
                setMajors(res.data.majors)
            })
    }

    // if (switching) {
    //     return (<Redirect to='/login'/>)
    // }

    return (
        <div className="container-fluid" id='registerForm'>
            {
                switching?<Redirect to='/confirm-email'/>:<></>
            }
            <div className="row justify-content-center">


                <div className="form-login">
                    <div className='card-header' style={{'width':'100%','backgroundColor':'rgb(142, 85, 142)'}}>

                    <h2 className='text-center' style={{'color':'#fff'}}>
                        <img src={logo} alt=""/>
                        Create Your Cloud</h2>
                    </div>
                    <br/>
                    <form action="#" onSubmit={submit} method="post">

                        <div className='form-group'>
                            <input className='form-control auth' disabled={loading}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }}
                                   type="text" name="Your Name" placeholder="Full Name" required=""/>
                        </div>
                        <div className='form-group'>
                            <input className='form-control auth' disabled={loading}
                                   onChange={(e) => {
                                       setEmail(e.target.value);

                                       if (
                                           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                                       ) {
                                           setErrEmail('email is not valid ')
                                       } else if (e.target.value === '')
                                           setErrEmail('')
                                       else
                                           setErrEmail('')
                                   }}
                                   type="email" name="email" placeholder="Email" required=""/>
                            <span style={{color: 'red'}}>{errEmail}</span>
                        </div>
                        <div className='form-group'>
                            <input className='form-control auth' disabled={loading}
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                   }}
                                   type="password" name="password" placeholder="Password"
                                   required=""/>
                        </div>
                        <div className='form-group'>
                            <input className='form-control auth' disabled={loading}
                                   onChange={(e) => {
                                       setCpassword(e.target.value)
                                   }}
                                   type="password" name="password"
                                   placeholder="Confirm Password" required=""/>
                        </div>

                        <div className='form-group'>
                            <select disabled={loading} onChange={(event) => {
                                setUni_id(event.target.value);
                                selectUni(event.target.value)
                            }} className='form-control auth' name="" id="">
                                <option value="">select your university</option>
                                {unis.map((uni, i) =>
                                    <option key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>)}
                            </select>
                        </div>
                        <div className='form-group'>
                            <select value={major_id} disabled={loading} onChange={(e) => {
                                setMajor_id(e.target.value)
                            }} className='form-control auth' name="" id="">
                                <option value="">select your major</option>
                                {majors.map((major, i) =>
                                    <option key={i}
                                            value={major.id}>{major.major_name}/({major.short_major_name})</option>)}
                            </select>
                        </div>
                        <div className="wthree-text">
                            <label className="anim">
                                <input type="checkbox" className="checkbox" required=""/>
                                <span><b style={{'color':'rgb(142, 85, 142)'}}> I Agree To <a style={{'paddingLeft':'3px'}} href="">The Terms & Conditions</a></b> </span>
                            </label>
                        </div>
                        <button  style={{'backgroundColor':'rgba(142, 85, 142,1)'}}
                            disabled={loading} className='btn btn-secondary btn-block' type="submit">
                            {loading ? <span>signing up...</span> : <span>sign up <i className="fa fa-user-plus"
                                                                                     aria-hidden="true"></i></span>}
                        </button>
                    </form>
                    <p style={{color:'red'}}>{err}</p>
                    <p className={' text-primary'}>Have an Account?
                        <Link style={{'paddingLeft':'3px'}} className='btn btn-link' to={'/login'}>
                            <u>login</u>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
