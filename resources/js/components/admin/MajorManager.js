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
    const [unis, setUnis] = useState([]);
    const [uni_id, setUni_id] = useState(0);
    const [muni_id, setMUni_id] = useState(0);
    const [show,setShow]=useState(true)
    //add major
    const [opened, setOpened] = useState(true);
    const [majorName, setMajorName] = useState('');
    const [majorShortName, setMajorShortName] = useState('');
    const [majors, setMajors] = useState([]);
    // edit major
    const [uniEditId, setUniEditId] = useState(0);
    const [majorEditName, setMajorEditName] = useState('');
    const [majorEditShortName, setMajorEditShortName] = useState('');

    function deleteMode(e){
        e.preventDefault()
        setSwitchAction(0)
    }
    function updateMode(e){
        e.preventDefault()
        setSwitchAction(1)
    }
    async function deleteMajor(event){
        event.preventDefault()
        let major_id=event.target.id;
        setLoading(true)

        await axios.patch("http://127.0.0.1:8000/api/auth/admin/majors/deleteMajor/"+major_id
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
                $('#majorEditModal'+res.data.id).modal('hide');
                const filterItems=majors.filter(item=>{
                    return item.id.toString() !==res.data.id.toString();
                })
                setMajors(filterItems);


                setLoading(false)
            }
        });

    }
    async function handleEditMajor(event){
        event.preventDefault()
        let major_id=event.target.id;
        setLoading(true)
        if (majorEditName === '' || majorEditShortName === '' || uniEditId==0|| uniEditId=='') {
            setErrEditUniErr('all fields required')
            setLoading(false)
        } else {
            await axios.patch("http://127.0.0.1:8000/api/auth/admin/majors/editMajor/"+major_id, {
                    'university_id':uniEditId,
                    'major_name': majorEditName,
                    'short_major_name': majorEditShortName,
                }

            ).then((res) => {
                if (res.data.status === 0) {
                    console.log(res.data)
                    setErrEditUniErr(res.data.error)
                    setLoading(false)
                }
                else if (res.data.status === 2) {
                    setErrEditUniErr('major name or short name is already exist in this university')
                    setLoading(false)
                }
                else {

                    const itemIndex=majors.findIndex(i=>i.id===res.data.major.id)
                    majors[itemIndex]=res.data.major
                    setMajors([...majors])
                    $('#majorEditModal'+res.data.major.id).modal('hide');
                    setMUni_id(res.data.major.university_id)
                    getMajors(res.data.major.university_id)

                    setLoading(false)
                }
            });

        }
    }


    const handleAddMajor=async e=> {
        e.preventDefault()
        setLoading(true)
        if (majorName === '' || majorShortName === '') {
            setUniErr('all fields required')
            setLoading(false)
        } else {
            await axios.post("http://127.0.0.1:8000/api/auth/admin/majors/addMajor", {
                'university_id':uni_id,
                'major_name': majorName,
                'short_major_name': majorShortName,
            }).then((res) => {
                if (res.data.status === 0) {
                    setUniErr(res.data.error)
                    setLoading(false)
                }
                else if (res.data.status === 2) {
                    setUniErr('major name or short name is already exist in this university')
                    setLoading(false)
                }
                else {
                    console.log(res.data)
                    // setMajors(prevState => [
                    //     ...prevState,{...res.data.major}]
                    // )
                    setMUni_id(res.data.major.university_id)
                    getMajors(res.data.major.university_id)
                    setLoading(false)
                    setMajorName('')
                    setMajorShortName('')
                }
            });

        }
    }
    async function getUnis() {
        await axios.get("http://127.0.0.1:8000/api/getAllUnis")
            .then((res) => {
                setUnis(res.data.unis)
            })
    }
    const handleUniChange=(t)=>{
        if (t.target.value==0){
            setShow(true)
        }else setShow(false)
        setMUni_id(t.target.value)
        // alert()
        getMajors(t.target.value);
    }
    async function getMajors(id) {

        await axios.post("http://127.0.0.1:8000/api/auth/admin/majors/getMajorsByUni",{
            'uni_id':id
        })
            .then((res) => {
                console.log(res.data)
                setMajors(res.data.majors)
            })
    }
    useEffect(() => {
            getMajors(muni_id);

        }
        , []);
    useEffect(() => {

            getUnis()
        }
        , []);
    return (
        <div>
            <div>
                <h3 className='' style={{'color':'rgb(142, 85, 142)'}}>New Major</h3>
                <form onSubmit={handleAddMajor}  className='form-inline' action=" ">
                    <div className='form-group'>
                        <select disabled={loading} onChange={(event) => {
                            setUni_id(event.target.value);
                            // selectUni()
                        }} className='form-control' name="" id="">
                            <option value="">select major's university</option>
                            {unis.map((uni, i) =>
                                <option key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <input value={majorName}
                               onChange={event => setMajorName(event.target.value)}
                               disabled={loading}  placeholder='name' type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <input value={majorShortName}
                               onChange={event => setMajorShortName(event.target.value)}
                               disabled={loading} placeholder='short name' type="text" className="form-control"/>
                    </div>
                    <button disabled={loading} style={{'backgroundColor':'rgb(142, 85, 142)'}}
                            className='btn btn-secondary'>
                        {loading ? <span>adding...</span> : <span className='text-light'><i className='fa fa-plus'></i></span>}
                    </button>

                </form>
                <p style={{'color':'red'}}>{uniErr}</p>
            </div>
            <h1><hr/></h1>
            <h3 className='' style={{'color':'rgb(142, 85, 142)'}}>Majors</h3>
            <div className='form-group'>
                <select value={muni_id} disabled={loading} onChange={handleUniChange} className='form-control' name="" id="major_manager_select">
                    <option value='0'>all</option>
                    {unis.map((uni, i) =>
                        <option key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>)}
                </select>
            </div>
            <div className="table table-responsive">
                <table className="table-dark">
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td>Short name</td>
                        {show?
                            <td>
                                University
                            </td>:
                            <></>

                        }
                        <td>Actions</td>

                    </tr>
                    </thead>
                    <tbody>
                    {majors.map((major, i) =>
                        <tr key={major.id.toString()}>
                            <td>{major.major_name}</td>
                            <td>{major.short_major_name}</td>
                            {
                               show?
                                    <td>{major.uni_name}</td>:
                                    <></>
                            }
                            <td>
                                <button
                                    data-toggle="modal" data-target={'#majorEditModal'+major.id}
                                    style={{'backgroundColor':'rgb(142, 85, 142)'}}
                                    className='btn btn-secondary'><i className='fa fa-edit'></i></button>

                                {opened?
                                    <div className="modal" id={'majorEditModal'+major.id}>
                                        <div className="modal-dialog" id={'majorEditModalD'+major.id}>
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Edit University</h4>
                                                    <button type="button" className="close"
                                                            data-dismiss="modal">&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                    {switchAction===1?

                                                        <form
                                                            id={'major_'+major.id}
                                                            onSubmit={deleteMode}
                                                            action=" ">
                                                            <input  type="hidden" value={major.id}/>

                                                            <div className='form-group'>
                                                                <select
                                                                    disabled={loading} onChange={(event) => {
                                                                    setUniEditId(event.target.value);
                                                                    // selectUni()
                                                                }} className='form-control' name="" id="">
                                                                    <option value="">select major's university</option>
                                                                    {unis.map((uni, i) =>
                                                                    uni.id===major.university_id?
                                                                        <option selected={true}  key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>

                                                                        :
                                                                        <option key={i} value={uni.id}>{uni.uni_name}/({uni.uni_short_name})</option>


                                                                        )}
                                                                </select>
                                                            </div>
                                                            <div className="form-group">

                                                                <input defaultValue={major.major_name}
                                                                       onChange={event => setMajorEditName(event.target.value)}
                                                                       disabled={loading}  placeholder='new name of university' type="text" className="form-control"/>
                                                            </div>
                                                            <div className="form-group">
                                                                <input
                                                                    defaultValue={major.short_major_name}
                                                                    onChange={event => setMajorEditShortName(event.target.value)}
                                                                    disabled={loading} placeholder=' new short name of university' type="text" className="form-control"/>
                                                            </div>
                                                            <button
                                                                id={'major_'+major.id}
                                                                onClick={handleEditMajor}
                                                                // onDoubleClick={handleEditUni}
                                                                disabled={loading} className='btn btn-primary'>
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
                                                                    delete this university will delete all majors and courses related to it!!
                                                                </b>
                                                            </p>
                                                            <button   id={'major_'+major.id}
                                                                      onClick={deleteMajor}
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
                </table>




            </div>
        </div>
    );
}
