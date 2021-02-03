import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Progress} from "reactstrap";
import moment from "moment";
import pdf from '../images/pdf-icon.png'
import video from '../images/Video.png'
import {Document, Page, pdfjs} from 'react-pdf';
import {Navbar} from "./Navbar";
import LoadingBar from "react-top-loading-bar";
import ReactPlayer from 'react-player/lazy';
import {Redirect} from "react-router-dom";
import Footer from "./Footer";


export default function MajorUploads() {
    if (!localStorage.getItem('token')){
        return <Redirect to='/roles'/>
    }
    if (localStorage.getItem('major_id')===''){
        return <Redirect to='/roles'/>
    }
    const [baseUrl] = useState('http://localhost:8000/uploads/');
    const [files, setFiles] = useState([]);
    const [course_id, setCourse_id] = useState(0)
    const [desc, setDesc] = useState('')
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [isUploding, setUploding] = useState(false);
    const [progress, setProgress] = useState(0);
    let major_id = localStorage.getItem('major_id')
    const [uploads, setUploads] = useState([])
    const [uploadsLoading, setUploadsLoading] = useState(false)
    const [title, setTitle] = useState('All Uploads')
    const [searched, setSearched] = useState('')
    const [chosen, setChosen] = useState(0)

    // uploads
    function getUploads() {
        setChosen(0)
        setTitle('all uploads')
        axios.post("http://127.0.0.1:8000/api/auth/author/uploads/getMajorUploads", {
            'major_id': major_id
        })
            .then((res) => {
                console.log(res.data)
                setUploads(res.data.uploads)
                setProgress(100)

            })
    }

    useEffect(() => {


            getUploads()
        }
        , []);

    // function searchUploads(e){
    //     setSearched(e.target.value)
    //     console.log(e.target.value)
    //     axios.post("http://127.0.0.1:8000/api/auth/students/uploads/searchMajorUploads", {
    //         'major_id': major_id,
    //         'search':e.target.value
    //     })
    //         .then((res) => {
    //             console.log(res.data)
    //             setUploads(res.data.uploads)
    //
    //         })
    // }


    //end uploads


    useEffect(() => {
            function getCourses() {

                axios.post("http://127.0.0.1:8000/api/getMajorCourses", {
                    'major_id': major_id
                })
                    .then((res) => {
                        console.log(res.data)
                        setCourses(res.data.courses)
                    })
            }

            getCourses()
        }
        , []);

    async function download(e) {
        let upload_id = e.target.value;
        console.log(upload_id);
        axios.post("http://127.0.0.1:8000/api/auth/student/uploads/downloadZipUpload", {
                'upload_id': upload_id
            }, {
                onDownloadProgress: ({loaded, total}) => {
                    let pro = ((loaded / total) * 100).toFixed(2);
                    setProgress(pro);
                }
            }
        )
            .then(function (response) {
                const url = 'http://127.0.0.1:8000/zips/' + response.data.upload;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', response.data.upload);
                document.body.appendChild(link);
                link.click();
                deleteZip(response.data.upload)
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    function deleteZip(desc){
        axios.post("http://127.0.0.1:8000/api/auth/student/uploads/deleteZip", {
            'desc': desc
        })
    }
    function Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getCourseUploads(e) {
        console.log(e.target.value);
        setUploadsLoading(true)
        let course_id = e.target.value;

        setChosen(course_id)
        axios.post("http://127.0.0.1:8000/api/auth/student/uploads/getCourseUploads", {
            'course_id': course_id
        })
            .then((res) => {
                setProgress(10)
                console.log(res.data)
                setUploads(res.data.uploads)
                setTitle(res.data.uploads[0].course_name + ' uploads')
                setUploadsLoading(false)
                setProgress(100)
            })
    }
    var fixmeTop = $('.fixme').offset()?.top;       // get initial position of the element

    $(window).scroll(function() {                  // assign scroll event listener

        var currentScroll = $(window).scrollTop(); // get current position

        if (currentScroll >= fixmeTop) {           // apply position: fixed if you
            $('.fixme').css({                      // scroll to that element or below it
                position: 'fixed',
                top: '100px',
                left: '18px',
                width:'200px'
            });
        } else {                                   // apply position: static
            $('.fixme').css({                      // if you scroll above it
                position: 'static',

            });
        }

    });


    return (
        <div className="container-fluid">
            <LoadingBar
                color='#008DD5'
                height='5px'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Navbar/>
            <div className='row'>
                <div className='col-md-12 uploads-header'>
                    <div style={{'opacity':'.6'}}
                         className='my-auto'>
                        <div id="color-overlay">
                            <center>
                                <div className='col-sm-4' >
                                    <h3  style={{'padding':'10px','color':'#2c343b',
                                        'backgroundColor':'rgba(0, 0, 0,.4)','text-align':'center','position':'relative','top':'200px'}} className='text-light my-auto'>
                                        {localStorage.getItem('major_name')} / {localStorage.getItem('uni_name')}
                                    </h3>
                                </div>
                            </center>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row ">
                <div className="col-md-2">
                    <h2 className='text-center' style={{'color': '  rgb(142, 85, 142)'}}>Courses</h2>
                    <div className='list-group fixme '>
                        <button type='button'
                                value='0'
                                onClick={getUploads}
                                className={chosen === 0 ? "list-group-item active list-group-item-action"
                                    : "list-group-item list-group-item-action"
                                }

                                style={{'cursor': 'pointer'}}><h6>All</h6></button>
                        {
                            courses.map((c, i) =>
                                <button
                                    disabled={uploadsLoading}
                                    onClick={getCourseUploads}
                                    value={c.id}
                                    id={'uploads_course_' + c.id} key={c.id.toString()} style={{'cursor': 'pointer'}}
                                    className={chosen == c.id ? "list-group-item active list-group-item-action"
                                        : "list-group-item list-group-item-action"
                                    }>
                                    <span>
                                    <span style={{'fontSize':'16px'}}>{c.course_name}</span>
                                        <span className='pull-right'>({c.uploads_num})</span></span>
                                </button>
                            )
                        }
                    </div>
                </div>
                <div className="col-md-8">
                    <h2 className='text-center' style={{'color': 'rgb(142, 85, 142)'}}>{Capitalize(title)}</h2>
                    <div>
                        {
                            uploads.map((course, i) =>
                                    <div className='card' style={{'marginBottom': '10px'}}
                                         key={course.id.toString()}>
                                        <div className="card-header">
                                            <h3>{course.course_name}/{course.short_course_name}</h3>
                                        </div>
                                        <div className="card-body">
                                            {
                                                course.uploads.map((upload, i) =>
                                                        <div
                                                            style={{'marginBottom': '10px'}}
                                                            key={upload.id.toString()}
                                                             className="card ">
                                                            <div className="card-header">
                                                                {Capitalize(upload.description)}
                                                                <span className='float-right'>
                                                            <button className='btn btn-link btn-outline-light download_btn' value={upload.id}
                                                                    onClick={download}><i className='fa fa-download  text-light'>

                                                            </i></button>
                                                        </span>
                                                            </div>
                                                            <div className="card-body">
                                                                {
                                                                    upload.files.map((file, i) =>
                                                                            <div style={{
                                                                                'display': 'inline-block',
                                                                                'width': '200px !important',
                                                                                'cursor': 'pointer',
                                                                                'marginLeft':'10px',

                                                                            }} key={file.id.toString()}
                                                                                 data-toggle="modal"

                                                                                 data-target={'#file_' + file.id}
                                                                                 className="card">

                                                                                <div className="card-body">
                                                                                    <div>
                                                                                        {
                                                                                            file.file_type === 'application/pdf' ?
                                                                                                <span><img style={{
                                                                                                    'display': 'inline-block',
                                                                                                    'width': '100px',
                                                                                                    'cursor': 'pointer'
                                                                                                }} src={pdf} alt=""/>

                                                                                                         <div
                                                                                                             className="modal fade"
                                                                                                             id={'file_' + file.id}>
                                                                                                  <div
                                                                                                      className="modal-dialog modal-lg"
                                                                                                      role="document">
                                                                                                    <div
                                                                                                        className="modal-content">
                                                                                                      <div
                                                                                                          className="modal-body">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="close"
                                                                                                            data-dismiss="modal"
                                                                                                            aria-label="Close">
                                                                                                          <span
                                                                                                              aria-hidden="true">&times;</span>
                                                                                                        </button>
                                                                                                          <object
                                                                                                              type="application/pdf"
                                                                                                              data={baseUrl + file.file_path}
                                                                                                              width="100%"
                                                                                                              height="500"
                                                                                                              style={{"height": '85vh'}}>No Support</object>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </div>
                                                                                                         </span>
                                                                                                : file.file_type === 'image/png' || file.file_type === 'image/jpeg' ?
                                                                                                <span>
                                                                                            <img style={{
                                                                                                'display': 'inline-block',
                                                                                                'width': '100px',
                                                                                                'cursor': 'pointer'
                                                                                            }}
                                                                                                 src={baseUrl + file.file_path}
                                                                                                 alt=""/>

                                                                                                         <div
                                                                                                             className="modal fade"
                                                                                                             id={'file_' + file.id}>
                                                                                                  <div
                                                                                                      className="modal-dialog modal-lg"
                                                                                                      role="image">
                                                                                                    <div
                                                                                                        className="modal-content">
                                                                                                      <div
                                                                                                          className="modal-body">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="close"
                                                                                                            data-dismiss="modal"
                                                                                                            aria-label="Close">
                                                                                                          <span
                                                                                                              aria-hidden="true">&times;</span>
                                                                                                        </button>
                                                                                                     <img
                                                                                                         className='img-fluid'
                                                                                                         src={baseUrl + file.file_path}
                                                                                                         alt=""/>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </div>

                                                                                        </span>
                                                                                                :
                                                                                                file.file_type === 'video/mp4' ?
                                                                                                    <span>
                                                                                                        {/*<div style={{'backgroundColor':'rgba(0,0,0,.6)',*/}
                                                                                                        {/*    'width':'100%',*/}
                                                                                                        {/*    'height':'100%',*/}

                                                                                                        {/*}}>*/}

                                                                                                        {/*</div>*/}
                                                                                                        <i
                                                                                                            style={{'position':'absolute',
                                                                                                                    'marginTop':'18px',
                                                                                                                    'marginLeft':'37px',
                                                                                                                    'fontSize':'42px',
                                                                                                                    'color':'rgba(0, 0, 0, .4)',
                                                                                                                'zIndex':'30'
                                                                                                            }}
                                                                                                            className='fa fa-play'> </i>
                                                                                                        <ReactPlayer
                                                                                                            className='react-player'
                                                                                                            url={baseUrl +file.file_path}
                                                                                                            width='100px'
                                                                                                            height='75px'
                                                                                                            style={{'position':'relative','bottom':'-20px !important',
                                                                                                                'backgroundColor':'rgba(0,0,0)',}}
                                                                                                        >
                                                                                                            <i className='fa fa-caret-right text-dark text-md'> </i>
                                                                                                        </ReactPlayer>

                                                                                                         <div
                                                                                                             className="modal fade"
                                                                                                             id={'file_' + file.id}>
                                                                                                  <div
                                                                                                      className="modal-dialog modal-lg"
                                                                                                      role="image">
                                                                                                    <div
                                                                                                        className="modal-content">
                                                                                                      <div
                                                                                                          className="modal-body">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            className="close"
                                                                                                            data-dismiss="modal"
                                                                                                            aria-label="Close">
                                                                                                          <span
                                                                                                              aria-hidden="true">&times;</span>
                                                                                                        </button>

                                                                                                        <div
                                                                                                            className="embed-responsive embed-responsive-16by9">
                                                                                                            <video
                                                                                                                className="video-fluid z-depth-1"
                                                                                                                loop
                                                                                                                controls
                                                                                                                muted>
                                                                                                                      <source src={baseUrl +file.file_path} type="video/mp4"/>
                                                                                                                    </video>
                                                                                                        </div>

                                                                                                      </div>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </div>

                                                                                        </span>
                                                                                                    :


                                                                                                    <span>no type</span>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="card-footer">
                                                                <p><span className='float-left  text-light'>
                                                    {moment(upload.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                                                </span></p>
                                                            </div>

                                                        </div>
                                                )
                                            }
                                        </div>
                                        <br/>

                                    </div>
                            )

                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <Footer/>
            </div>
        </div>
    )
}
