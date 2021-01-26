import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Link, NavLink, Redirect} from "react-router-dom";
import logo from '../images/logo_v1.png'
import {toast} from "react-toastify";
// import NavLink from "react-router-dom/modules/NavLink";

export function Navbar(){

    useEffect(() => {

            var pusher = new Pusher('145fd4707199ab20c070', {
                cluster: 'ap2',
                forceTLS: true,
                encrypted: true
            });
            var channel = pusher.subscribe('student-cloud');
            channel.bind('question-status', function(data) {
                var question = data['question'];
                console.log(question)
                if (question.user_id == localStorage.getItem('userId')) {
                    getNotes();

                }
            })


        }
        , []);

    const user_id=localStorage.getItem('userId');
    const [notes,setNotes]=useState([]);
    const [notesCount,setNotesCount]=useState(0);
    async function getNotes(){
        await axios.post("http://localhost:8000/api/auth/user/notes/getNotes", {
            "user_id": user_id,
        })
            .then((res) => {
                    console.log(res.data.notes)
                   setNotes(res.data.notes)
                   setNotesCount(res.data.count_notes)

                }
            )
    }
    async function showAndSetAsRead(){
        await axios.post("http://localhost:8000/api/auth/user/notes/setAsRead", {
            "user_id": user_id,
        })
            .then((res) => {

                    if(res.data.status===1) {
                        if(setNotesCount(0))
                            $('#navbarTogglerDemo01').toggle();

                    }

                }
            )
    }
    useEffect(() => {
        getNotes();
    },[])

    return(
        <nav className="navbar navbar-dark navbar-expand-lg nav-students fixed-top">
            <button className=" navbar-toggler" type="button"
                    onClick={showAndSetAsRead}
                    data-toggle="collapse" data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" > </span>
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo01">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt=""/>
                    {/*<div  style={{'position':'relative','top':'-25px','height':'50px'}}*/}
                    {/*>*/}
                    {/*    /!*#969a9d*!/*/}
                    {/*    <span style={{'padding':"0",'position':'relative','top':'20px','fontSize':'48px','color':'#f73859'}} className="fa fa-cloud"> </span>*/}
                    {/*    <br/>*/}
                    {/*    <span style={{'position':'relative','top':'-14px','fontSize':'32px','color':'#2c343b'}}*/}
                    {/*          className='fa fa-graduation-cap'> </span>*/}
                    {/*</div>*/}
                    {/*<img width="50" height="40" className="d-inline-block align-top" src={logo} alt=""/>*/}
                </a>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item ">

                        <NavLink className="nav-link" activeClassName="active" to="/home">Home <span className="sr-only">(current)</span></NavLink>
                    </li>
                    {
                        localStorage.getItem('role_id')=='3'?
                            <li className="nav-item">
                                <NavLink  className="nav-link" to='/author-dashboard'>Dashboard</NavLink>
                            </li>:<></>
                    }
                    <li className="nav-item">
                        <NavLink  className="nav-link" activeClassName="active" to='/MajorUploads'>Uploads</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink  className="nav-link" activeClassName="active" to='/questions'>Questions</NavLink>

                    </li>
                     <li className="nav-item">
                        <NavLink  className="nav-link" activeClassName="active" to='/Blog'>Blog</NavLink>

                    </li>
                    <li className="nav-item">
                        <NavLink  className="nav-link" activeClassName="active" to='/chat'>Chat</NavLink>

                    </li>
                </ul>

                    <ul className="navbar-nav  mt-lg-0">
                        {localStorage.getItem('logged') ?

                            <li>
                                <Link id='profile_nav' className="nav-link" to="/profile">
                                {
                                localStorage.getItem('photo_path')=='null'?
                                <div style={{'padding':'auto',
                                    'border':'0.5px solid rgba(142, 85, 142,1)',
                                    'backgroundColor':'black',
                                    'width':'35px',
                                    'height':'35px','position':'relative','top':'3px'
                                }} className='rounded-circle align-content-center'>

                                            <span  style={{'fontSize':'22px'}} className='my-auto text-light'>
                                                <center>
                                                    {localStorage.getItem('username').charAt(0).toUpperCase()}
                                            </center>
                                                </span>


                                </div>
                                    : <img
                                        style={{'padding':'2px',
                                            'width':'50px',
                                            'height':'50px'
                                        }} className='rounded-circle'

                                        src={'http://localhost:8000/photos/'+localStorage.getItem('photo_path')} alt=""/>
                                        }
                                </Link>
                            </li>

                            :<></>
                        }
                        {localStorage.getItem('logged') ?

                            <li className="nav-item" style={{"position": "relative", 'top': '20px'}}>
                                <div className="dropdown float-left" style={{"padding": "13px !important"}}>
                                    <a href="#" role="button" data-toggle="dropdown"
                                       id="dropdownMenu1" data-target="#" style={{"float": " left"}}
                                       aria-expanded="true">
                                        <i  className="fa fa-bell-o fa-4" style={{
                                            "fontSize": " 20px",'color':'rgba(255, 255, 255,.6)'
                                        }}>
                                        </i>
                                    </a>
                                    {
                                        notesCount===0?
                                            <></>:
                                            <span
                                                onClick={showAndSetAsRead}
                                                data-toggle="dropdown"
                                                id="dropdownMenu1" data-target="#" aria-expanded="true"
                                                className="badge badge-danger float-left"

                                                style={{'zIndex': 1, 'cursor': 'pointer'}}>{notesCount}</span>
                                    }

                                    <ul style={{'overflow':'auto','height':'500px','backgroundColor':'rgba(142, 85, 142,1)'}}
                                        className="dropdown-menu dropdown-menu-right pull-right" role="menu"
                                        aria-labelledby="dropdownMenu1">
                                        <li role="presentation">
                                            <center>
                                            <span className="dropdown-menu-header text-light align-center">Notifications</span>
                                            </center>
                                        </li>
                                        <ul className="timeline timeline-icons timeline-sm"
                                            style={{"margin": "10px", "width": "210px"}}>

                                            {
                                                notes.length>0?
                                                    notes.map((note,i)=>
                                                        <li key={note.id.toString()}>
                                                            {note.type === 'question' ?
                                                                <Link className="nav-link"  to={'/questions/'+note.notifiable_id}>{note.data}</Link>
                                                                :
                                                                <p>{note.data}</p>
                                                            }

                                                        </li>
                                                    )
                                                    :<></>
                                            }
                                        </ul>
                                        {/*<li role="presentation">*/}
                                        {/*    <a href="#" className="dropdown-menu-header"> </a>*/}
                                        {/*</li>*/}
                                    </ul>
                                </div>

                            </li>:<></>


                        }
                        {localStorage.getItem('logged')?
                        <li className="nav-item ">
                            <Link style={{"position": "relative", 'top': '10px'}} className="nav-link active" to="/logout">Logout</Link>
                        </li>:
                            <li className="nav-item ">
                            <Link style={{"position": "relative", 'top': '10px'}} className="nav-link" to="/login">Login</Link>
                            </li>
                            }
                   </ul>

            </div>
        </nav>
    )
}
