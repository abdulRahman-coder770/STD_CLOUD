import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "../student/Navbar";
import DropZone from "../Parts/dropzone/DropZone";
import Uploader from "./Uploader";
import Dropzone from 'react-dropzone'
import MyDropzone from './Dropzone'
import {Redirect} from "react-router-dom";
import QuestionsManager from "./QuestionsManager";
import Footer from "../student/Footer";


export default function AuthorDashboard() {
    if (!localStorage.getItem('token')){
        return <Redirect to='/roles'/>
    }
    if (localStorage.getItem('role_id')==='1'
        || localStorage.getItem('role_id')==='4'
        || localStorage.getItem('role_id')==='2'
    ){
        return <Redirect to='/roles'/>
    }
    return (
        <div className="container-fluid admin" >



            <div className="row">
                {/*<div className='col-sm-12'><h5 className='text-light'>*/}
                {/*   <span className='float-left'>Major Admin: {localStorage.getItem('username')}</span>*/}

                {/*    <span className='float-right'>Major: {localStorage.getItem('major_name')} / {localStorage.getItem('uni_name')}</span>*/}
                {/*</h5>*/}
                {/*    <br/><hr/><br/></div>*/}

                <div className="col-md-3 pills-container">
                    <br/><br/>
                    {/*    <div className="justify-content-center">*/}
                    {/*        <br/><br/>*/}
                    {/*        <p className='text-light'>{localStorage.getItem('username')}</p>*/}
                    {/*        <p className='text-light'>*/}
                    {/*            University: {localStorage.getItem('uni_name')}*/}
                    {/*        </p>*/}
                    {/*        <p className='text-light'>*/}
                    {/*            Major: {localStorage.getItem('major_name')}*/}
                    {/*        </p>*/}

                    {/*</div>*/}
                    <h1 className='text-center text-black-50 '><span className='text-light'>
                        <b><i className="fa fa-sliders" aria-hidden="true"></i> Menu</b> </span></h1>
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">

                        {/*<a className="nav-link " id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home"*/}
                        {/*   role="tab" aria-controls="v-pills-home" aria-selected="true">Home</a>*/}
                        <a className="nav-link active" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile"
                           role="tab" aria-controls="v-pills-profile" aria-selected="false">
                            <i className="fa fa-cloud-upload " aria-hidden="true"></i> Uploads</a>

                        <a className="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages"
                           role="tab" aria-controls="v-pills-messages" aria-selected="false">
                            <i className="fa fa-question " aria-hidden="true"></i> Questions</a>

                        <a className="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings"
                           role="tab" aria-controls="v-pills-settings" aria-selected="false">
                            <i className="fa fa-users " aria-hidden="true"></i> Students</a>
                        <a className="nav-link" href="/logout"
                        ><i className="fa fa-sign-out " aria-hidden="true"></i> Logout</a>
                    </div>
                </div>
                <div className="col-md-9 tabContent-container">
                    <Navbar className='col-md-9'/>
                    <br/>
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade " id="v-pills-home" role="tabpanel"
                             aria-labelledby="v-pills-home-tab">...1
                        </div>
                        <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel"
                             aria-labelledby="v-pills-profile-tab">

                            <div>
                                <MyDropzone/>
                            </div>

                        </div>
                        <div className="tab-pane fade" id="v-pills-messages" role="tabpanel"
                             aria-labelledby="v-pills-messages-tab">
                            <div>
                                <QuestionsManager/>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                             aria-labelledby="v-pills-settings-tab">...4
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
