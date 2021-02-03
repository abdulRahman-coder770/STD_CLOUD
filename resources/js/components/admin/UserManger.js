import React, {useState, useEffect, useContext} from 'react';
import ReactDOM from 'react-dom';
import Toggle from 'react-bootstrap-toggle';
import imgLoading from '../images/loading.gif';
import $ from 'jquery';
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import RichTextEditor from "../Parts/RichTextEditor";
import avatar from "../images/avatar.png";
import {toast, ToastContainer} from "react-toastify";


export default function UserManager() {

    const [unis, setUnis] = useState([]);
    const [majors, setMajors] = useState([]);
    const [uni_id, setUni_id] = useState('');
    const [major_id, setMajor_id] = useState('');
    const [loading, setLoading] = useState(false);
    const [errEmail, setErrEmail] = useState('');
    const [err, setErr] = useState('');
    const [switching, setSwitching] = useState(false)

    const [showUsers, setShowUsers] = useState(false)
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)

    const [user_id, setUser_id] = useState('')
    const [userUni, setUserUni] = useState('')
    const [userUnis, setUserUnis] = useState([])
    const [userMajor, setUserMajor] = useState('')
    const [userMajors, setUserMajors] = useState([])
    const [userRole, setUserRole] = useState('')
    const [userRoles, setUserRoles] = useState([])

    async function getRoles(){
        await axios.post("http://127.0.0.1:8000/api/auth/admin/users/getRoles", {
            'user_id': user_id
        })
            .then((res) => {
                console.log(res.data.roles)
            setUserRoles(res.data.roles)
            })
    }
    async function updateUserEduInfo(e){
        await axios.post("http://127.0.0.1:8000/api/auth/admin/users/updateUserEduInfo", {
            'university_id': userUni,
            'role_id': userRole,
            'major_id': userMajor,
            'id':e.target.value
        }).then((res) => {
            if (res.data.status===1){
                toast('info updated successfully ')

            }
        })

    }
    async function resetPassword(e){
        e.preventDefault()
        await axios.post("http://127.0.0.1:8000/api/auth/admin/users/resetPassword", {
            'id': e.target.value
        }).then((res) => {
            if (res.data.status===1){
                toast('password reset successfully ')

            }
        })

    }
    async function switchActive(e) {
        let user_id = e.target.value;
        let token = localStorage.getItem("token");


        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        setUser_id(user_id)
        await axios.post("http://127.0.0.1:8000/api/auth/admin/users/switchActive", {
            'user_id': user_id
        }
        // ,{
        //     headers
        //     }
            )
            .then((res) => {
                console.log(res.data.user.is_active)
                console.log(res.data.u)
                if (res.data.user.is_active === 0) {
                    $('#btn_active_' + user_id).css('background-color', 'red');

                } else {
                    $('#btn_active_' + user_id).css('background-color', 'green');
                }
            })

    }


    useEffect(() => {
        getRoles();
            function getUnis() {
                axios.get("http://127.0.0.1:8000/api/getAllUnis")
                    .then((res) => {
                        console.log(res.data)
                        setUnis(res.data.unis)
                        setUserUnis(res.data.unis)
                    })
            }

            getUnis()
        }
        , []);
    async function selectUserUni(t) {

        if (t===0 || t===''){
            setUserMajors([])

            return
        }
        await axios.post("http://127.0.0.1:8000/api/getUniMajors", {
            'uni_id': t
        })
            .then((res) => {
                // console.log(res.data)
                setUserMajors(res.data.majors)
            })
    }
    async function selectUni(t) {

        if (t===0 || t===''){
            setMajors([])
            setShowUsers(false)
            setUsers([])

            return
        }
        await axios.post("http://127.0.0.1:8000/api/getUniMajors", {
            'uni_id': t
        })
            .then((res) => {
                // console.log(res.data)
                setMajors(res.data.majors)
                setUserMajors(res.data.majors)
            })
    }

    async function getUsersByMajor(t) {
        if (t == 0 || t === '') {
            setShowUsers(false)
            setUsers([])
            return
        }
        setUsersLoading(true)
        // console.log(uni_id);
        await axios.post("http://127.0.0.1:8000/api/auth/admin/users/getUsersByMajor", {
            'major_id': t
        })
            .then((res) => {
                setShowUsers(true)
                setUsers(res.data.users)
                setUsersLoading(false)
            })
    }


    return (
        <div className="container-fluid">
            <ToastContainer />

            <div className="row">

                <div className='col-md-9'>
                    <div className='form-group'>
                        <select disabled={loading} onChange={(event) => {
                            setUni_id(event.target.value);
                            selectUni(event.target.value)
                        }} className='form-control' name="" id="">
                            <option value="">select your university</option>
                            {unis.map((uni, i) =>
                                <option key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <select disabled={loading} onChange={(e) => {
                            getUsersByMajor(e.target.value)
                        }} className='form-control' name="" id="">
                            <option value="">select your major</option>
                            {majors.map((major, i) =>
                                <option key={i}
                                        value={major.id}>{major.major_name}/({major.short_major_name})</option>)}
                        </select>
                    </div>
                    <div className='table table-responsive'>
                        <table className='table table-hover table-dark'>
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Active/Not Active</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            {
                                showUsers ?
                                    <tbody>
                                    {usersLoading ?
                                        <tr>
                                            <td colSpan={5}>
                                                <div style={{
                                                    'width': 150
                                                    , 'height': 150, 'margin': 0
                                                }} className='justify-content-center'>
                                                    <img width={150} src={imgLoading} height={100} alt=""/>
                                                </div>
                                            </td>
                                        </tr>
                                        :
                                        users.map((user, i) =>
                                            <tr key={user.id.toString()}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role_name}</td>
                                                <td>{user.is_active === 1 ?

                                                    // <label className="switch">
                                                    //     <input id={'btn_active_' + user.id} type="checkbox"
                                                    //            // onCh={switchActive}
                                                    //         checked/>
                                                    //         <span className="slider"></span>
                                                    // </label>:
                                                    // <label className="switch">
                                                    //     <input id={'btn_active_' + user.id} onClick={switchActive} type="checkbox"/>
                                                    //         <span className="slider"></span>
                                                    // </label>
                                                    <button id={'btn_active_' + user.id} value={user.id}
                                                            onClick={switchActive}
                                                            style={{
                                                                'border-radius': '50%',
                                                                'width': '10px',
                                                                'height': '25px',
                                                                'backgroundColor': 'green',
                                                            }} className='btn btn-default'> </button>
                                                    :
                                                    <button id={'btn_active_' + user.id} value={user.id}
                                                            onClick={switchActive}
                                                            style={{
                                                                'border-radius': '50%',
                                                                'width': '10px',
                                                                'height': '25px',
                                                                'backgroundColor': 'red',
                                                            }} className='btn btn-default'> </button>
                                                }</td>
                                                <td>

                                                    <button    style={{'backgroundColor':'rgb(142, 85, 142)'}}
                                                               className='btn btn-secondary'
                                                               data-toggle="modal" data-target={"#ModalPreviewUser"+user.id}
                                                    >
                                                        <i className='fa fa-edit'></i>
                                                    </button>
                                                    <div className="modal fade right" id={"ModalPreviewUser"+user.id} tabIndex="-1"
                                                         role="dialog" aria-labelledby="exampleModalPreviewLabel" aria-hidden="true">
                                                        <div className="modal-dialog-full-width modal-dialog momodel modal-fluid"
                                                             role="document">
                                                            <div className="modal-content-full-width modal-content ">
                                                                <div className=" modal-header-full-width   modal-header">
                                                                    <h3 className="modal-title w-100"
                                                                        style={{'color':'#8E558E !important'}}
                                                                        id="exampleModalPreviewLabel">{user.name}</h3>
                                                                    <button type="button" className="close " data-dismiss="modal"
                                                                            aria-label="Close">
                                                        <span style={{"font-size":" 1.3em"}}
                                                              aria-hidden="true">x</span>
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className='row'>
                                                                        <div  className='col-sm-6 text-md-left'>
                                                                            <div className="card">
                                                                                <div  className="card-header">Profile</div>

                                                                                <div className="card-body">
                                                                                    <div   style={{'padding':'2px',

                                                                                    }} className='row rounded-circle'>
                                                                                    <center>
                                                                                        <img align='center' id='img_preview'
                                                                                             style={{'padding':'2px',
                                                                                                 'border':'0.5px solid white',
                                                                                                 'backgroundColor':'black',
                                                                                                 'width':'80%',
                                                                                                 'height':'280px'

                                                                                             }} className='rounded'


                                                                                                     src={user.photo_path?'http://localhost:8000/photos/'+user.photo_path:avatar}

                                                                                              alt=""/>
                                                                                    </center>

                                                                                    </div>
                                                                                    <br/>
                                                                                    <button value={user.id} onClick={resetPassword} className='btn btn-block btn-danger'>reset password</button>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-sm-6 preview'>
                                                                            <div className="card">
                                                                                <div  className="card-header">Education Info</div>

                                                                                <div className="card-body">
                                                                                    <form>
                                                                                        <div className='form-group'>
                                                                                            <select disabled={loading} onChange={(event) => {
                                                                                                setUserUni(event.target.value);
                                                                                                selectUserUni(event.target.value)
                                                                                            }} className='form-control' name="" id="">
                                                                                                <option value="">select your university</option>
                                                                                                {userUnis.map((uni, i) =>

                                                                                                    uni.id===user.university_id?
                                                                                                        <option selected={true}  key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>

                                                                                                        :
                                                                                                        <option key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>



                                                                                                )}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className='form-group'>
                                                                                            <select disabled={loading} onChange={(e) => {
                                                                                                setUserMajor(e.target.value)
                                                                                            }} className='form-control' name="" id="">
                                                                                                <option value="">select your major</option>
                                                                                                {userMajors.map((major, i) =>
                                                                                                    major.id===user.major_id?
                                                                                                        <option selected={true}  key={i} value={major.id}>{major.major_name}/({major.short_major_name})</option>

                                                                                                        :
                                                                                                        <option key={i} value={major.id}>{major.major_name}/({major.short_major_name})</option>
                                                                                                )}

                                                                                            </select>
                                                                                        </div>
                                                                                        <div className='form-group'>
                                                                                            <select disabled={loading} onChange={(e) => setUserRole(e.target.value)}
                                                                                                    className='form-control' name="" id="">
                                                                                                <option value="">select your major</option>
                                                                                                {userRoles.map((r, i) =>
                                                                                                    r.id==1 ?
                                                                                                        <></>:
                                                                                                        r.id==2 ?
                                                                                                            <></>:
                                                                                                            r.id===user.role_id?
                                                                                                                <option selected={true}  key={i} value={r.id}>{r.role_name}</option>

                                                                                                                :
                                                                                                                <option key={i} value={r.id}>{r.role_name}</option>
                                                                                                )}

                                                                                            </select>
                                                                                        </div>
                                                                                        <button value={user.id} onClick={updateUserEduInfo} className='btn btn-block btn-success'>Save</button>
                                                                                    </form>
                                                                                </div>
                                                                            </div>


                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="modal-footer-full-width  modal-footer">
                                                                    <button type="button" className="btn btn-danger btn-md btn-rounded"
                                                                            data-dismiss="modal">Close
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    :
                                    <tbody>
                                    <tr>
                                        <td colSpan={5}><h3>please choose university and major</h3></td>
                                    </tr>
                                    </tbody>
                            }
                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
}
