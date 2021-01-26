import './main.css';
import _ from 'lodash';
import {Progress} from 'reactstrap';
import React, {useEffect, useState} from 'react';
import uplodIcon from './upload.png';

export default function DropZone(props) {
    let {id, label, uploadUrl} = props;
    const [isUploding, setUploding] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setProgress] = useState(0);

    const [course_id,setCourse_id]=useState(0)
    const [desc,setDesc]=useState('')
    const [courses,setCourses]=useState([])
    const [loading,setLoading]=useState(false)
    let major_id=localStorage.getItem('major_id')
    const config = { headers: { Authorization: localStorage.getItem('token'),
            "Content-Type": "multipart/form-data; " +
                "boundary=---------------------------974767299852498929531610575" } };

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


        function handleUpload (e){
            e.preventDefault();
            let formData = new FormData();
            formData.append('file', e.target.file);

        setUploding(true);
         axios.post('http://127.0.0.1:8000/api/auth/author/uploads/addUpload', {
            // 'files': files,
            'course_id': course_id,
            'desc':desc

        }).then((res) => {
            let upload_id=res.data.upload_id;
            // console.log(files)
            // let data=new FormData();


            // data.append('file',uploadedFiles)
            formData.append('upload_id',upload_id)
            console.log(uploadedFiles)
             axios.post('http://127.0.0.1:8000/api/auth/author/uploads/addFiles', {
               'file':uploadedFiles,
                 'upload_id':upload_id
                     // formData,

            },

                config,


            ).then((r)=>{
                console.log(r.data)
                setLoading(false)
             })
            }
        );


    }

    const handleChange = async e => {
        // onChange(e) {
        //    setFiles([e.target.files[0]])
        // console.log(e.target.files[0])
        // }
        let {files} = e.target;

        let formData = new FormData();
        _.forEach(files, file => {
            formData.append('files', file);
            uploadedFiles.push(file);

        });
        console.log(uploadedFiles)
        //
        setUploadedFiles(uploadedFiles)

        // setUploding(true);
        // let {data} = await axios.post(uploadUrl, formData, {
        //     onUploadProgress: ({loaded, total}) => {
        //         let progress = ((loaded / total) * 100).toFixed(2);
        //         setProgress(progress);
        //     }
        // });
        // setUploding(false);
    }

    return (
        <div>
            <h2><span><b>university:</b></span><span className='float-right'><b>major:</b></span></h2>
            <form onSubmit={handleUpload} encType='multipart/form-data'>
                <div className="form-group">
                    <input placeholder='description'
                           onChange={(event) => {
                               setDesc(event.target.value);}}
                           className='form-control' aria-multiline='true' type="text"/>
                </div>
                <div className='form-group'>
                    <select disabled={loading} onChange={(event) => {
                        setCourse_id(event.target.value);
                    }} className='form-control auth' name="" id="">
                        <option value="">select the course</option>
                        {courses.map((c, i) =>
                            <option key={i} value={c.id}>{c.course_name}/({c.short_course_name})</option>)}
                    </select>
                </div>
            <div className="form-group">
                <label htmlFor={id} className="text-primary font-weight-bold">upload multi files</label>
                <div className="d-flex">
                    <div className="d-flex">
                        <div className="file-uploader-mask d-flex justify-content-center align-items-center">
                            <img width={100} className="file-uploader-icon" src={uplodIcon} alt="Upload-Icon"/>
                        </div>
                        <input multiple name='file' className="file-input" type="file" id={id} onChange={handleChange}/>
                    </div>
                    {
                        isUploding ? (
                            <div className="flex-grow-1 px-2">
                                <div className="text-center">{uploadProgress}%</div>
                                <Progress value={uploadProgress}/>
                            </div>
                        ) : null
                    }
                </div>
                {/*<div className="d-flex flex-wrap mt-4">*/}
                {/*    {*/}
                {/*        uploadedImgs && !isUploding ? (*/}
                {/*            uploadedImgs.map(uploadedImg => (*/}
                {/*                <img src={uploadedImg} key={uploadedImg} alt="UploadedImage"*/}
                {/*                     className="img-thumbnail img-fluid uploaded-img mr-2"/>*/}
                {/*            ))*/}
                {/*        ) : null*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
                <div className='form-group'>
                    <button className='btn btn-success' type='submit'>upload</button>
                </div>
        </form>
        </div>
    )
}
