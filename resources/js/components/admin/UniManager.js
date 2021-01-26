import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Progress} from "reactstrap";
import $ from "jquery";
import {Chart} from "react-google-charts";
import {ToastContainer} from "react-toastify";


export default function UniManager() {
    const[switchAction,setSwitchAction]=useState(1)
    const [loading, setLoading] = useState(false);
    const [uniErr, setUniErr] = useState('');
    const [errEditUniErr, setErrEditUniErr] = useState('');
    //get unis
    const [unis, setUnis] = useState([]);
    //add uni
    const [opened, setOpened] = useState(true);
    const [uniName, setUniName] = useState('');
    const [uniShortName, setUniShortName] = useState('');
    const [uniEditName, setUniEditName] = useState('');
    const [uniEditShortName, setUniEditShortName] = useState('');
    const [uniInfo,setUniInfo]=useState(0)
    const [majors,setMajors]=useState([])
    const [chart,setChart]=useState([])

    function deleteMode(e){
        e.preventDefault()
        setSwitchAction(0)
    }
    async function expandUni(e){
        // alert(e.target.value)
        await axios.post("http://127.0.0.1:8000/api/auth/admin/unis/getUni"
            ,
            {
                'id':e.target.value
            }).then((res) => {
                setUniInfo(res.data.uni)
                setChart(res.data.chart_data)
        })
    }

    function updateMode(e){
        e.preventDefault()
        setSwitchAction(1)
    }
    async function deleteUni(event){
        event.preventDefault()
        let uni_id=event.target.id;
        setLoading(true)

        await axios.patch("http://127.0.0.1:8000/api/auth/admin/uni/deleteUni/"+uni_id
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
                // let modalD=document.getElementById('uniEditModalD'+res.data.id)
                // modal.style=
                // modalD.parentNode.removeChild(modalD)
                $('#uniEditModal'+res.data.id).modal('hide');
                const filterItems=unis.filter(item=>{
                    return item.id.toString() !==res.data.id.toString();
                })
                setUnis(filterItems);
                setSwitchAction(1)

                setLoading(false)
            }
        });

    }

    const handleAddUni=async e=> {
        e.preventDefault()
        setLoading(true)
        if (uniName === '' || uniShortName === '') {
            setUniErr('all fields required')
            setLoading(false)
        } else {
            await axios.post("http://127.0.0.1:8000/api/auth/admin/uni/addUni", {
                'uni_name': uniName,
                'uni_short_name': uniShortName,
            }).then((res) => {
                if (res.data.status === 0) {
                    setUniErr(res.data.error)
                    setLoading(false)
                }
                else if (res.data.status === 2) {
                    setUniErr('university name or short name is already exist')
                    setLoading(false)
                }
                else {
                    // setUni(res.data.uni)

                    setUnis(prevState => [
                        ...prevState,{...res.data.uni}]
                    )
                    setLoading(false)
                    setUniName('')
                    setUniShortName('')
                }
            });

        }
    }

    async function handleEditUni(event){
        event.preventDefault()
        let uni_id=event.target.id;
        setLoading(true)
        if (uniEditName === '' || uniEditShortName === '') {
            setErrEditUniErr('all fields required')
            setLoading(false)
        } else {
            await axios.patch("http://127.0.0.1:8000/api/auth/admin/uni/editUni/"+uni_id, {
                    'uni_name': uniEditName,
                    'uni_short_name': uniEditShortName,
                }
                ,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            ).then((res) => {
                if (res.data.status === 0) {
                    console.log(res.data)
                    setErrEditUniErr(res.data.error)
                    setLoading(false)
                } else {

                    const itemIndex=unis.findIndex(i=>i.id===res.data.uni.id)
                    unis[itemIndex]=res.data.uni
                    setUnis([...unis])
                    $('#uniEditModal'+res.data.uni.id).modal('hide');
                    // setOpened(false)


                    // setUnis(prevState => [
                    //     ...prevState,{...res.data.uni}]
                    // )
                    setLoading(false)
                }
            });

        }
    }


    useEffect(() => {
            async function getUnis() {
                await axios.get("http://127.0.0.1:8000/api/getAllUnis")
                    .then((res) => {
                        console.log(res.data)
                        setUnis(res.data.unis)
                    })
            }
            getUnis()
        }
        , []);
    return (
       <div className='container-fluid'>
           <ToastContainer />
           <div className="row">
           <div className='col-md-12'>
               <h3 style={{'color':'rgb(142, 85, 142)'}} className=''>New University</h3>
               <form onSubmit={handleAddUni} className='form-inline' action=" ">

                   <div className="form-group">
                       <input value={uniName}
                              onChange={event => setUniName(event.target.value)}
                              disabled={loading}  placeholder='Name of university' type="text" className="form-control"/>
                   </div>
                   <div className="form-group">
                       <input value={uniShortName}
                              onChange={event => setUniShortName(event.target.value)}
                              disabled={loading} placeholder='Short name of university' type="text" className="form-control"/>
                   </div>
                   <button style={{'backgroundColor':'rgb(142, 85, 142)'}} disabled={loading} className='btn btn-secondary'>
                       {loading ? <span>adding...</span> : <span className='text-light'>
                           <i className='fa fa-plus'></i></span>}
                   </button>

               </form>
               <p style={{'color':'red'}}>{uniErr}</p>

           <h1><br/></h1>
           </div>
           </div>
           <div className="row">
               <div className="col-md-6">

           <div className="table table-responsive">
               <table className="table-dark">
                   <thead>
                   <tr>
                       <td>Name</td>
                       <td>Short Name</td>
                       <td>Actions</td>
                   </tr>
                   </thead>
                   <tbody>
                   {unis.map((uni, i) =>
                       <tr key={uni.id.toString()}>
                           <td>{uni.uni_name}</td>
                           <td>{uni.uni_short_name}</td>
                           <td>
                               <button
                                   data-toggle="modal" data-target={'#uniEditModal'+uni.id}
                                   style={{'color':'rgb(142, 85, 142)','backgroundColor':'white'}}
                                   className='btn btn-secondary'>
                                   <i className='fa fa-edit'></i></button>
                               {opened?
                                   <div className="modal" id={'uniEditModal'+uni.id}>
                                       <div className="modal-dialog" id={'uniEditModalD'+uni.id}>
                                           <div className="modal-content">
                                               <div className="modal-header">
                                                   <h4 className="modal-title">Edit University</h4>
                                                   <button type="button" className="close"
                                                           data-dismiss="modal">&times;</button>
                                               </div>
                                               <div className="modal-body">
                                                   {switchAction===1?

                                                       <form  action=" ">
                                                           <input  type="hidden" value={uni.id}/>
                                                           <div className="form-group">

                                                               <input defaultValue={uni.uni_name}
                                                                      onChange={event => setUniEditName(event.target.value)}
                                                                      disabled={loading}  placeholder='new name of university' type="text" className="form-control"/>
                                                           </div>
                                                           <div className="form-group">
                                                               <input
                                                                   defaultValue={uni.uni_short_name}
                                                                   onChange={event => setUniEditShortName(event.target.value)}
                                                                   disabled={loading} placeholder=' new short name of university' type="text" className="form-control"/>
                                                           </div>
                                                           <button
                                                               id={'uni_'+uni.id}
                                                               onClick={handleEditUni}
                                                               onDoubleClick={handleEditUni}
                                                               disabled={loading} className='btn btn-primary'>
                                                               {loading ? <span>updating...</span> : <span>update</span>}
                                                           </button>
                                                           <button
                                                               id={'uni_'+uni.id}
                                                               onClick={deleteMode}
                                                               disabled={loading} className='btn btn-light'>
                                                               <span>delete</span>
                                                           </button>

                                                           <p style={{'color':'red'}}><span>{errEditUniErr}</span></p>

                                                       </form>
                                                       :
                                                       <div>
                                                           <p className='text-light'>
                                                               <b>
                                                                   delete this university will delete all majors and courses related to it!!
                                                               </b>
                                                           </p>
                                                           <button   id={'uni_'+uni.id}
                                                                     onClick={deleteUni}
                                                               // onDoubleClick={deleteUni}
                                                                     disabled={loading} className='btn btn-light'>
                                                               {loading ? <span>deleting...</span> : <span>confirm</span>}
                                                           </button>
                                                           <button
                                                               onClick={updateMode}
                                                               className='btn btn-warning'>back</button>
                                                       </div>
                                                   }
                                               </div>


                                               <div className="modal-footer">
                                                   <button type="button" className="btn btn-light"
                                                           data-dismiss="modal">Close
                                                   </button>
                                               </div>

                                           </div>
                                       </div>
                                   </div>:
                                   <></>
                               }
                               <button value={uni.id}
                                       onClick={expandUni}
                                       style={{'color':'rgb(142, 85, 142)','backgroundColor':'white'
                                       ,'zIndex':10
                                       }}
                                       className='btn btn-secondary' ><i onClick={expandUni}
                                                                         value={uni.id}
                                                                         className='fa fa-expand'></i></button>
                           </td>
                       </tr>
                   )}

                   </tbody>
               </table>




           </div>
       </div>
               <div className='col-md-6'>
                   {
                       uniInfo===0?
                           <center><h3>please expand a university</h3></center>:
                           <div className={"my-pretty-chart-container"}>
                               <center><h2 style={{'color':'rgb(142, 85, 142)'}}>{uniInfo.uni_name}</h2>
                               <h3 className='' style={{'color':'rgb(142, 85, 142)'}}>Majors & Users</h3></center>:

                               <Chart
                                   chartType="PieChart"
                                   data={chart}
                                   width={"100%"}
                                   fill-color='#2c343b'
                                   height={"250px"}
                                   options={{

                                       // Just add this option
                                       is3D: true,
                                   }}

                                   legendToggle
                                   allowHtml={true}
                               />
                           </div>

                   }



               </div>
           </div>
       </div>
    );
}
