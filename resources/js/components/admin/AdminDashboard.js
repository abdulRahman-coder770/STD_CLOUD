import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router-dom";
import DropZone from "../Parts/dropzone/DropZone";
import $ from 'jquery';
import UniManager from "./UniManager";
import MajorManager from "./MajorManager";
import CourseManager from "./CourseManager";
import UserManager from "./UserManger";
import AdminHome from "./Home";


export default function AdminDashboard() {
    if (!localStorage.getItem('token')) {
        return <Redirect to='/roles'/>
    }
    if (localStorage.getItem('role_id') === '3' || localStorage.getItem('role_id') === '4') {
        return <Redirect to='/roles'/>
    }

    return (
        <div className="container-fluid">
            {/*<div className="row">*/}
            {/*    <br/><br/>*/}
            {/*    <div className='col-sm-12'>*/}
            {/*        */}
            {/*        <br/><br/></div>*/}
            {/*    <br/><br/>*/}
            {/*</div>*/}
            <div className="row">
                <br/><br/>
                <div className="col-md-2 admin-menu" style={{'backgroundColor':'rgb(142, 85, 142)'}}>

                    <h1 className='text-center text-black-50 '><span className='text-light'><br/>
                        <b><i className="fa fa-sliders" aria-hidden="true"></i> Menu</b> </span></h1>
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home"
                           role="tab" aria-controls="v-pills-home" aria-selected="true">
                            <i className="fa fa-home" aria-hidden="true"></i> Home</a>
                        <a className="nav-link " id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile"
                           role="tab" aria-controls="v-pills-profile" aria-selected="false">
                            <i className="fa fa-university" aria-hidden="true"></i> Universities</a>
                        <a className="nav-link " id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages"
                           role="tab" aria-controls="v-pills-messages" aria-selected="false">
                            <i className="fa fa-desktop" aria-hidden="true"></i> Majors</a>
                        <a className="nav-link " id="v-pills-settings-tab" data-toggle="pill"
                           href="#v-pills-settings"
                           role="tab" aria-controls="v-pills-settings" aria-selected="false">
                            <i className="fa fa-leanpub" aria-hidden="true"></i> Courses</a>
                        <a className="nav-link " id="v-pills-users-tab" data-toggle="pill"
                           href="#v-pills-users"
                           role="tab" aria-controls="v-pills-settings" aria-selected="false">
                            <i className="fa fa-users" aria-hidden="true"></i> Users</a>
                        <a className="nav-link" href="/logout"
                        ><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
                    </div>
                </div>
                <div className="col-9">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel"
                             aria-labelledby="v-pills-home-tab">
                            <br/><br/>
                            <AdminHome/>
                        </div>
                        <div className="tab-pane fade " id="v-pills-profile" role="tabpanel"
                             aria-labelledby="v-pills-profile-tab"><br/><br/>
                            <UniManager/>
                        </div>
                        <div className="tab-pane fade " id="v-pills-messages" role="tabpanel"
                             aria-labelledby="v-pills-messages-tab"><br/><br/>
                            <MajorManager/>
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                             aria-labelledby="v-pills-settings-tab"><br/><br/>
                            <CourseManager/>
                        </div>
                        <div className="tab-pane fade " id="v-pills-users" role="tabpanel"
                             aria-labelledby="v-pills-users-tab"><br/><br/>
                            <UserManager/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
