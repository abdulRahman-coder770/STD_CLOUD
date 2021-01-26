import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Progress} from "reactstrap";
import $ from "jquery";


export default function MajorManager() {
    const[switchAction,setSwitchAction]=useState(1)
    const [uniErr, setUniErr] = useState('');
    const [errEditUniErr, setErrEditUniErr] = useState('');
    const [loading, setLoading] = useState(false);
    //get majors
    const [majors, setMajors] = useState([]);
    const [major_id, setMajor_id] = useState(0);
    const [mmajor_id, setMMajor_id] = useState(0);
    const [show,setShow]=useState(true)
    //add major
    const [opened, setOpened] = useState(true);
    const [courseName, setCourseName] = useState('');
    const [courseShortName, setCourseShortName] = useState('');
    const [courses, setCourses] = useState([]);
    // edit major
    const [majorEditId, setMajorEditId] = useState(0);
    const [courseEditName, setCourseEditName] = useState('');
    const [courseEditShortName, setCourseEditShortName] = useState('');
    const [showCourse,setShowCourse]=useState(false)

    function deleteMode(e){
        e.preventDefault()
        setSwitchAction(0)
    }
    function updateMode(e){
        e.preventDefault()
        setSwitchAction(1)
    }
    async function deleteCourse(event){
        event.preventDefault()
        let course_id=event.target.id;
        setLoading(true)

        await axios.patch("http://127.0.0.1:8000/api/auth/admin/courses/deleteCourse/"+course_id
            ,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((res) => {
            if (res.data.status === 0) {
                console.log(res.data)
                setLoading(false)
            } else {
                $('#courseEditModal'+res.data.id).modal('hide');
                const filterItems=courses.filter(item=>{
                    return item.id.toString() !==res.data.id.toString();
                })
                setCourses(filterItems);
                setSwitchAction(1)


                setLoading(false)
            }
        });

    }
    async function handleEditCourse(event){
        event.preventDefault()
        let course_id=event.target.id;
        setLoading(true)
        if (courseEditName === '' || courseEditShortName === '' || majorEditId==0|| majorEditId=='') {
            setErrEditUniErr('all fields required')
            setLoading(false)
        } else {
            await axios.patch("http://127.0.0.1:8000/api/auth/admin/courses/editCourse/"+course_id, {
                    'major_id':majorEditId,
                    'course_name': courseEditName,
                    'short_course_name': courseEditShortName,
                }
            ).then((res) => {
                if (res.data.status === 0) {
                    console.log(res.data)
                    setErrEditUniErr(res.data.error)
                    setLoading(false)
                }
                else if (res.data.status === 2) {
                    setErrEditUniErr('course name or short name is already exist in this major')
                    setLoading(false)
                }
                else {
                    const itemIndex=courses.findIndex(i=>i.id===res.data.course.id)
                    courses[itemIndex]=res.data.course
                    setCourses([...courses])
                    setMMajor_id(res.data.course.major_id)
                    getCourses(res.data.course.major_id)
                    $('#courseEditModal'+res.data.course.id).modal('hide');
                    setLoading(false)
                }
            });

        }
    }


    const handleAddCourse=async e=> {
        e.preventDefault()
        setLoading(true)
        if (courseName === '' || courseShortName === '') {
            setUniErr('all fields required')
            setLoading(false)
        } else {
            await axios.post("http://127.0.0.1:8000/api/auth/admin/courses/addCourse", {
                'major_id':major_id,
                'course_name': courseName,
                'short_course_name': courseShortName,
            }).then((res) => {
                if (res.data.status === 0) {
                    setUniErr(res.data.error)
                    setLoading(false)
                }
                else if (res.data.status === 2) {
                    setUniErr('course name or short name is already exist in this major')
                    setLoading(false)
                }
                else {
                    console.log(res.data)

                    setMMajor_id(res.data.course.major_id)
                    getCourses(res.data.course.major_id)
                    setShowCourse(true)
                    setLoading(false)
                    setCourseName('')
                    setCourseShortName('')
                }
            });

        }
    }
    async function getMajors() {
        await axios.get("http://127.0.0.1:8000/api/getAllMajors")
            .then((res) => {
                setMajors(res.data.majors)
            })
    }
    const handleMajorChange=(t)=>{
        setShowCourse(true)
        if (t.target.value==0){
            setShow(true)
            setShowCourse(false)
            return
        }else setShow(false)
        setMMajor_id(t.target.value)
        // alert()
        getCourses(t.target.value);
    }
    async function getCourses(id) {

        await axios.post("http://127.0.0.1:8000/api/auth/admin/courses/getCoursesByMajor",{
            'major_id':id
        })
            .then((res) => {
                console.log(res.data)
                setCourses(res.data.courses)
            })
    }

    useEffect(() => {

            getMajors()
        }
        , []);

    return (
        <div>
            <div>
                <h3 className='' style={{'color':'rgb(142, 85, 142)'}}>New Course</h3>
                <form onSubmit={handleAddCourse}  className='form-inline' action=" ">
                    <div className='form-group'>
                        <select disabled={loading}
                                onChange={(event) => {
                                setMajor_id(event.target.value);

                        }} className='form-control' name="" id="">
                            <option value="">select major/ university</option>
                            {majors.map((major, i) =>
                                <option key={i} value={major.id}>{major.major_name}/({major.uni_name})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <input value={courseName}
                               onChange={event => setCourseName(event.target.value)}
                               disabled={loading}  placeholder='name' type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <input value={courseShortName}
                               onChange={event => setCourseShortName(event.target.value)}
                               disabled={loading} placeholder='short name' type="text" className="form-control"/>
                    </div>
                    <button disabled={loading} style={{'backgroundColor':'rgb(142, 85, 142)'}}
                            className='btn btn-secondary'>
                        {loading ? <span>adding...</span> : <span className='text-light'>
                            <i className='fa fa-plus'></i></span>}
                    </button>

                </form>
                <p style={{'color':'red'}}>{uniErr}</p>
            </div>
            <h1><hr/></h1>
            <h2 className='' style={{'color':'rgb(142, 85, 142)'}}>Courses</h2>
            <div className='form-group'>
                <select value={mmajor_id} disabled={loading} onChange={handleMajorChange} className='form-control' name="" id="major_manager_select">
                    <option value='0'>select major</option>
                    {majors.map((m, i) =>
                        <option key={i} value={m.id}>{m.major_name}/({m.uni_name})</option>)}
                </select>
            </div>
            <div className="table table-responsive">
                <table className="table-dark">
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td>Short Name</td>
                        {show?
                            <td>
                                Major
                            </td>:
                            <></>

                        }
                        <td>Actions</td>

                    </tr>
                    </thead>
                    {showCourse?
                    <tbody>


                    {courses.map((course, i) =>
                        <tr key={course.id.toString()}>
                            <td>{course.course_name}</td>
                            <td>{course.short_course_name}</td>
                            {
                                show?
                                    <td>{course.major_name}</td>:
                                    <></>
                            }
                            <td>
                                <button
                                    data-toggle="modal" data-target={'#courseEditModal'+course.id}
                                    style={{'backgroundColor':'rgb(142, 85, 142)'}}
                                    className='btn btn-secondary'><i className='fa fa-edit'></i></button>

                                {opened?
                                    <div className="modal" id={'courseEditModal'+course.id}>
                                        <div className="modal-dialog" id={'courseEditModalD'+course.id}>
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Edit course</h4>
                                                    <button type="button" className="close"
                                                            data-dismiss="modal">&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                    {switchAction===1?

                                                        <form
                                                            id={'course_'+course.id}
                                                            onSubmit={deleteMode}
                                                            action=" ">
                                                            <input  type="hidden" value={course.id}/>

                                                            <div className='form-group'>
                                                                <select
                                                                    disabled={loading} onChange={(event) => {
                                                                    setMajorEditId(event.target.value);
                                                                    // selectUni()
                                                                }} className='form-control' name="" id="">
                                                                    <option value="">select major/university</option>
                                                                    {majors.map((major, i) =>
                                                                        major.id===course.major_id?
                                                                            <option selected={true}  key={i} value={major.id}>{major.major_name}/({major.uni_name})</option>

                                                                            :
                                                                            <option key={i} value={major.id}>{major.major_name}/({major.uni_name})</option>


                                                                    )}
                                                                </select>
                                                            </div>
                                                            <div className="form-group">

                                                                <input defaultValue={course.course_name}
                                                                       onChange={event => setCourseEditName(event.target.value)}
                                                                       disabled={loading}  placeholder='new name of university' type="text" className="form-control"/>
                                                            </div>
                                                            <div className="form-group">
                                                                <input
                                                                    defaultValue={course.short_course_name}
                                                                    onChange={event => setCourseEditShortName(event.target.value)}
                                                                    disabled={loading} placeholder=' new short name of university' type="text" className="form-control"/>
                                                            </div>
                                                            <button
                                                                id={'course_'+course.id}
                                                                onClick={handleEditCourse}
                                                                // onDoubleClick={handleEditUni}
                                                                disabled={loading} className='btn btn-danger'>
                                                                {loading ? <span>updating...</span> : <span>update</span>}
                                                            </button>
                                                            <button

                                                                disabled={loading} className='btn btn-danger'>
                                                                <span>delete</span>
                                                            </button>

                                                            <p style={{'color':'red'}}><span>{errEditUniErr}</span></p>

                                                        </form>
                                                        :
                                                        <div>
                                                            <p className='text-danger'>
                                                                <b>
                                                                    delete this course will delete all uploads and files related to it!!
                                                                </b>
                                                            </p>
                                                            <button   id={'course_'+course.id}
                                                                      onClick={deleteCourse}
                                                                      disabled={loading} className='btn btn-danger'>
                                                                {loading ? <span>deleting...</span> : <span>confirm</span>}
                                                            </button>
                                                            <button
                                                                onClick={updateMode}
                                                                className='btn btn-warning'>back</button>
                                                        </div>
                                                    }
                                                </div>


                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-danger"
                                                            data-dismiss="modal">Close
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>:
                                    <></>
                                }


                            </td>

                        </tr>
                    )}

                    </tbody>
                        :<tbody><tr><td colSpan={4}><h3>please choose a major</h3></td></tr></tbody>}
                </table>




            </div>
        </div>
    );
}
