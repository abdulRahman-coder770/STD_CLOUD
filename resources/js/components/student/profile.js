import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "./Navbar";
import ReactSummernote from 'react-summernote';
import RichTextEditor from "../Parts/RichTextEditor";
import parse from "html-react-parser"
import moment from 'moment'
import {Link, Redirect} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import {toast, ToastContainer} from "react-toastify";
import avatar from '../images/avatar.png'
import Footer from "./Footer";

export default function profile(){

    const [photo,setPhoto]=useState('')
    const [about,setAbout]=useState(localStorage.getItem('about'))
    const [name,setName]=useState('')
    const [oldPassword,setOldPassword]=useState('')
    const [newPassword,setNewPassword]=useState('')
    const [err,setErr]=useState('')


    function updateInfo(e){
        e.preventDefault()

        if (name==='' && oldPassword==='' && newPassword===''){
            alert('no thing to update')
            return
        }
        if (oldPassword==='' && newPassword!==''){
            alert('please enter the old password firstly')
            return
        }
        axios.post('http://127.0.0.1:8000/api/auth/student/profile/updateInfo', {
            "user_id": localStorage.getItem('userId'),
            'name':name,
            'oldPass':oldPassword,
            'newPass':newPassword
            }
        ).then((r) => {
            if (r.data.status==0){

                setErr(r.data.message)
            }
            else {
                localStorage.setItem('username',r.data.user.name)
                window.location = ''
            }
        })
    }

    function updateProfile(e){
            e.preventDefault()
            const formData = new FormData();

        let sfiles = document.getElementById("input_preview").files
        formData.append("file", sfiles[0]);
        formData.append("user_id", localStorage.getItem('userId'));
        formData.append("about", about);


            axios.post('http://127.0.0.1:8000/api/auth/student/profile/update', formData,
                {
                    headers: {'content-type': 'multipart/form-data'},
                }
            ).then((r) => {
             localStorage.setItem('photo_path',r.data.user.photo_path)
             localStorage.setItem('about',r.data.user.about)
                window.location=''
            })
    }

    function handleChangeImg(event){
        var image = document.getElementById('img_preview');
        image.setAttribute('src',URL.createObjectURL(event.target.files[0])) ;
        // console.log(URL.createObjectURL(event.target.files[0]))
        // setPhoto( URL.createObjectURL(event.target.files[0]))
    }


    return(
        <>
        <Navbar/>
        <div><br/><br/><br/><br/><br/><br/><br/></div>
        <div className='container'>
            <div className="row">
                <div className="col-sm-4">
                    <div  style={{'padding':'2px',
                        'width':'300px',
                        'height':'300px'
                    }} className='rounded-circle'>
                        {
                            localStorage.getItem('photo_path')=='null'?
                                <img src={avatar} id={'img_preview'}  style={{'padding':'2px',
                                    'border':'0.5px solid white',
                                    'backgroundColor':'black',
                                    'width':'300px',
                                    'height':'300px'
                                }} className='rounded-circle' alt=""/>
                                :
                                <img id='img_preview'
                                     style={{'padding':'2px',
                                         'border':'0.5px solid white',
                                         'backgroundColor':'black',
                                         'width':'300px',
                                         'height':'300px'
                                     }} className='rounded-circle'

                                       src={'http://localhost:8000/photos/'+localStorage.getItem('photo_path')} alt=""/>
                        }
                    </div>

                    <div >
                        <br/><br/>
                        <form onSubmit={updateProfile}  action="">
                            <div className={'form-group'}>
                                <input id='input_preview' type="file" accept="image/*" onChange={handleChangeImg} className='form-control'/>
                            </div>
                            <div className={'form-group'}>
                                <textarea defaultValue={about==''?'':localStorage.getItem('about')}
                                          onChange={event => setAbout(event.target.value)}  className='form-control' placeholder='about you'>

                                </textarea>
                            </div>
                            <button type={"submit"} className='btn btn-danger'>update

                            </button>
                            <br/><br/>
                        </form>
                    </div>
                </div>
                <div className="col-sm-8">
                    <br/><br/>
                    <div>
                        <form onSubmit={updateInfo} action="">
                            <div className={'form-group'}>
                                <input
                                    value={name===''?localStorage.getItem('username'):name}
                                    onChange={event => setName(event.target.value)}
                                    type="text" placeholder='type new name' className='form-control'/>
                            </div>
                            <div className={'form-group'}>
                                <input value={oldPassword}
                                       onChange={event => setOldPassword(event.target.value)}
                                       type='password'  className='form-control' placeholder='old password'/>
                            </div>
                            <div className={'form-group'}>
                                <input value={newPassword}
                                       onChange={event => setNewPassword(event.target.value)}
                                       type='password'  className='form-control' placeholder='new password'/>
                            </div>
                            <div>
                                <span className='text-danger'>
                                    {err}
                                </span>
                            </div>
                            <br/>
                            <button type={"submit"} className='btn btn-danger'>update</button>

                        </form>

                    </div>

                </div>
            </div>
            <div className="row">
                <Footer/>
            </div>
        </div>

        </>
    )
}
