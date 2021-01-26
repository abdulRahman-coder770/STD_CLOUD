import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Progress} from "reactstrap";
import moment from "moment";
import pdf from '../images/pdf-icon.png'
import {Document, Page, pdfjs} from 'react-pdf';
import ReactPlayer from "react-player/lazy";
import video from "../images/Video.png";
import {toast, ToastContainer} from "react-toastify";
import $ from "jquery";


export default function MyDropzone() {
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
    const [descEdit,setDescEdit]=useState('')

    // uploads
    function getUploads() {

        axios.post("http://127.0.0.1:8000/api/auth/author/uploads/getMajorUploads", {
            'major_id': major_id
        })
            .then((res) => {
                console.log(res.data)
                setUploads(res.data.uploads)

            })
    }

    useEffect(() => {


            getUploads()
        }
        , []);


    async function updateUpload(e){
        e.preventDefault()
        axios.post("http://127.0.0.1:8000/api/auth/author/uploads/updateUpload", {
            'id': e.target.value,
            'description':descEdit
        }).then((res) => {
            if (res.data.status==1) {
                toast.success('upload uploaded successfully ')
                getUploads()

            }
        })
    }
    async function deleteUpload(e){
        let id=e.target.value;
        e.preventDefault()
        axios.post("http://127.0.0.1:8000/api/auth/author/uploads/deleteUpload", {
            'id': e.target.value
        }).then((res) => {
            if (res.data.status==1) {
                toast.success('upload deleted successfully ')
                $('#editUpload_'+id).modal('hide');
                getUploads()
            }
        })
    }


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

    function removeFile(event) {
        event.preventDefault();
        let file_id = event.target.id;
        alert(file_id)
        const filterItems = files.filter(item => {
            return item.id.toString() !== file_id.toString();
        })
        setFiles(filterItems);
    }

    const fileHandler = e => {
        const fileArray = Array.from(e.target.files)
        fileArray.map(f => f["id"] = Math.random() * Math.pow(10, 16))
        setFiles(fileArray)
    }

    function upload(event) {
        event.preventDefault();
        console.log(files);
        setLoading(true);
        var d = new Date();
        var n = d.getFullYear();
        axios.post('http://127.0.0.1:8000/api/auth/author/uploads/addUpload', {
            // 'files': files,
            'year': n,
            'course_id': course_id,
            'desc': desc

        }).then((res) => {
                let upload_id = res.data.upload_id;
                let sfiles = document.getElementById("author-add-file").files
                for (let i = 0; i < sfiles.length; i++) {
                    console.log(sfiles[i])

                    const formData = new FormData();
                    formData.append("upload_id", upload_id);
                    formData.append("file", sfiles[i]);


                    setUploding(true);

                    axios.post('http://127.0.0.1:8000/api/auth/author/uploads/addFiles', formData,
                        {
                            headers: {'content-type': 'multipart/form-data'},
                            onUploadProgress: ({loaded, total}) => {
                                let progress = ((loaded / total) * 100).toFixed(2);
                                setProgress(progress);
                            }
                        }
                    ).then((r) => {
                        setUploding(false);
                        console.log(r.data)
                        setLoading(false)
                        setFiles([])
                        let uploadForm = document.getElementById('author-form-upload');
                        uploadForm.reset();
                        setDesc('')
                        getUploads();
                    })
                }
            }
        );
    }

    return (
        <div>
            <ToastContainer />
            <form onSubmit={upload} id='author-form-upload' action="">
                <div className='form-group'>
                    <select disabled={loading} onChange={(event) => {
                        setCourse_id(event.target.value)
                    }} className='form-control' name="" id="">
                        <option value="">select the course</option>
                        {courses.map((c, i) =>
                            <option key={i} value={c.id}>{c.course_name}/({c.short_course_name})</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <input value={desc}
                           onChange={event => setDesc(event.target.value)}
                           disabled={loading} placeholder='description for the upload' type="text"
                           className="form-control"/>
                </div>
                <div className='form-group'>
                    <input className='form-control-file' type="file" multiple
                           accept="image/*,application/pdf,video/mp4"
                           onChange={fileHandler}
                           id='author-add-file'
                           disabled={loading}
                    />
                </div>

                <div>
                    {files.length > 0 ?
                        files.map((file, i) =>
                            <div className='files' key={file.id.toString()}>
                                <button id={file.id} onClick={removeFile} className='btn btn-outline-danger'>
                                    x
                                </button>
                                <h3 className='text-light'>type:{file.type}</h3>
                                <span className='text-light'>{file.name}</span>
                            </div>
                        ) :
                        <></>

                    }
                </div>
                {
                    isUploding ? (
                        <div className="flex-grow-1 px-2">
                            <div className="text-center">{progress}%</div>
                            <Progress value={progress}/>
                            <br/>
                        </div>
                    ) : null
                }


                <button className='btn btn-secondary btn-block'
                        style={{'backgroundColor': '#8E558E', 'marginTop': '20px'}} type={"submit"}>
                    {loading ? <span>uploading...</span> : <span>
                        <i style={{'fontSize': '20px'}} className='fa fa-upload'></i></span>}
                </button>
            </form>
            <br/><br/><br/><br/>
            {/*<h2 style={{'color':'rgb(247, 56, 89)'}}>all uploads</h2>*/}
            <div>

                {
                    uploads.map((course, i) =>
                        <div className='card' key={course.id.toString()}>
                            <div className="card-header">
                                <h3>{course.course_name}/{course.short_course_name}</h3>
                            </div>
                            <div className="card-body">
                                {
                                    course.uploads.map((upload, i) =>
                                        <div key={upload.id.toString()} className="card">
                                            <div className="card-header">
                                                <span>{upload.description}</span>
                                                <span className='float-right'
                                                      data-toggle="modal"

                                                      data-target={'#editUpload_' + upload.id}
                                                ><i className='fa fa-edit'
                                                    data-toggle="modal"

                                                    data-target={'#editUpload_' + upload.id}
                                                ></i></span>
                                                <div className="modal fade"
                                                     id={'editUpload_' + upload.id}>
                                                    <div
                                                        className="modal-dialog modal-lg"
                                                        role="document">
                                                        <div
                                                            className="modal-content">
                                                            <button
                                                                type="button"
                                                                className="close"
                                                                data-dismiss="modal"
                                                                aria-label="Close">
                                                                    <span
                                                                        aria-hidden="true">&times;</span>
                                                            </button>
                                                            <div className="modal-body">
                                                                <div className="form-group">
                                                                    <label className='text-center text-muted' for="">the new description </label>
                                                                    <input defaultValue={upload.description}
                                                                           onChange={event => setDescEdit(event.target.value)}
                                                                           // value={descEdit}
                                                                           type="text"
                                                                           className="form-control"/>
                                                                </div>
                                                                <div className="form-group">
                                                                    <button
                                                                        onClick={updateUpload}
                                                                        value={upload.id}
                                                                        className='btn btn-warning btn-block'>update</button>
                                                                    <button
                                                                        onClick={deleteUpload}
                                                                        value={upload.id}
                                                                        className='btn btn-danger btn-block'>delete</button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="card-body">
                                                {
                                                    upload.files.map((file, i) =>
                                                        <div style={{
                                                            'display': 'inline-block',
                                                            'width': '200px !important',
                                                            'cursor': 'pointer',
                                                            'border':'2px solid rgb(0,0,0)'
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
                                                                                                        <ReactPlayer
                                                                                                            className='react-player'
                                                                                                            url={baseUrl + file.file_path}
                                                                                                            width='100px'
                                                                                                            height='100px'
                                                                                                        />

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
                                                                                                            className="embed-responsive embed-responsive-1by1">
                                                                                                            <video
                                                                                                                className="video-fluid z-depth-1"
                                                                                                                loop
                                                                                                                controls
                                                                                                                muted>
                                                                                                                      <source
                                                                                                                          src={baseUrl + file.file_path}
                                                                                                                          type="video/mp4"/>
                                                                                                                    </video>
                                                                                                        </div>

                                                                                                      </div>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </div>
                                                                                            </span>


                                                                                : <span>no type</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="card-footer">
                                                <p><span className='float-left text-white'>
                                                    {moment(upload.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                                                </span></p>
                                            </div>
                                            <br/>
                                        </div>

                                    )
                                }
                            </div>

                        </div>
                    )

                }
            </div>
        </div>
    )
}
