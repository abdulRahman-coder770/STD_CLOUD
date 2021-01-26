import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import ReactSummernote from 'react-summernote';
import RichTextEditor from "../Parts/RichTextEditor";
import parse from "html-react-parser"
import moment from 'moment'
import {Link} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";



export default function QuestionsManager() {

    const [question, setQuestion] = useState('')
    let major_id=localStorage.getItem('major_id');
    let userId=localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);

    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionItem, setQuestionItem] = useState([]);
    const [progress, setProgress] = useState(0)

    const [allow,setAllow]=useState(false)
    const [newQ,setNewQ]=useState([])

    const [rejectingReason,setRejectingReason]=useState('')



    async function getQuestions() {
        await axios.post("http://localhost:8000/api/auth/students/getQuestions", {
            "major_id": major_id,
        })
            .then((res) => {
                    console.log(res.data.questions)
                    setQuestions(res.data.questions)
                    setProgress(100)


                }
            )
    }

    useEffect(() => {

            var pusher = new Pusher('145fd4707199ab20c070', {
                cluster: 'ap2',
                forceTLS: true,
                encrypted: true
            });
            var channel = pusher.subscribe('student-cloud');
            channel.bind('question-added', function(data) {
                var question = data['question'];
                console.log(question[0])
                if (question[0].major_id==localStorage.getItem('major_id')){

                    setNewQ(prevState => [
                        ...prevState,{...question[0]}]
                    )
                toast('new question add by '+question[0].name+' and topic is '+question[0].topic)
                    }

            });

            getQuestions();
        }
        , []);

    function acceptQuestion(e){
        e.preventDefault()
        let id=e.target.value;
        axios.post("http://localhost:8000/api/auth/author/questions/acceptQuestion", {
            'id':id
        }).then((res) => {
            const filterItems=newQ.filter(item=>{
                return item.id.toString() !==id.toString();
            })
            setNewQ(filterItems);
            getQuestions()
            }
        )
    }
    function rejectQuestion(e){
        e.preventDefault()
        let id=e.target.value;
        axios.post("http://localhost:8000/api/auth/author/questions/rejectQuestion", {
            'id':id,
            'reason':rejectingReason
        }).then((res) => {
            $('#QRejectingModal'+id).modal('hide');
            const filterItems=newQ.filter(item=>{
                return item.id.toString() !==id.toString();
            })
            setNewQ(filterItems);
            getQuestions()

            }
        )
    }


    function addQuestion() {
        setLoading(true)
        axios.post("http://localhost:8000/api/auth/students/addQuestion", {
            "user_id": userId,
            'body': question,
            'topic': topic,
            'major_id':major_id
        })
            .then((res) => {
                    questions.unshift(res.data.question[0])
                    setQuestions(questions)

                    setQuestion('')
                    setTopic('')
                    setLoading(false)
                    console.log(res.data.question[0].name);
                }
            )
    }


    function onChange(content) {
        setQuestion(content);
    }

    return (

        <div className="container-fluid">
            <ToastContainer />
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className="row justify-content-center">

                <div className="col-md-10">
                    <div className="table-responsive">
                        <h3 style={{'color':'rgb(142, 85, 142)'}} className=''>new questions</h3>
                        <table style={{'backgroundColor':'rgb(142, 85, 142)','color':'white'}} className='table'>
                            <thead>
                            <tr>
                                <th>topic</th>
                                <th>by</th>
                                <th>answers</th>
                                <th>created at</th>
                                <th>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                newQ.map( (q, i)=>
                                    <tr key={q.id.toString()}>
                                        <td><b className='text-light'>{q.topic}</b></td>
                                        <td><b>{q.name}</b></td>
                                        <td>{q.count_answers>0 ?q.count_answers+' answers':'no answers yet'}</td>
                                        <td>{moment(q.post_date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td>

                                            <p><span>
                                                <button
                                                    onClick={acceptQuestion}
                                                    value={q.id} className='btn btn-outline-success'>
                                            <i className='fa fa-check'> </i>
                                        </button>
                                            </span>
                                                <span><button
                                                    data-toggle="modal" data-target={'#QRejectingModal'+q.id}
                                                    className='btn btn-outline-danger'>
                                            <i className='fa fa-ban'> </i>
                                        </button>
                                                    {/*start modal*/}
                                                    <div className="modal" id={'QRejectingModal'+q.id}>
                                       <div className="modal-dialog" >
                                           <div className="modal-content">
                                               <div className="modal-header">
                                                   <h4 className="modal-title">reject question</h4>
                                                   <button type="button" className="close"
                                                           data-dismiss="modal">&times;</button>
                                               </div>
                                               <div className="modal-body">
                                                   <form action="">
                                                  <textarea onChange={event => setRejectingReason(event.target.value)}
                                                            placeholder={'please type the rejecting reason'}
                                                            name="" id="" cols="30" rows="10"> </textarea>
                                                   <button
                                                       value={q.id}
                                                       onClick={rejectQuestion}
                                                       className={"btn btn-warning"}
                                                       type={"submit"}>
                                                       confirm
                                                   </button>
                                                   </form>
                                               </div>


                                               <div className="modal-footer">
                                                   <button type="button" className="btn btn-danger"
                                                           data-dismiss="modal">Close
                                                   </button>
                                               </div>

                                           </div>
                                       </div>
                                   </div>
                                                    {/*finish modal*/}
                                                </span>
                                            </p>

                                        </td>
                                    </tr>


                                )
                            }

                            {
                                questions.map( (q, i)=>
                                q.status==null?
                                    <tr key={q.id.toString()}>
                                        <td><Link to={'/questions/'+q.id}><b className='text-light'>{q.topic}</b></Link></td>
                                        <td><b>{q.name}</b></td>
                                        <td>{q.count_answers>0 ?q.count_answers+' answers':'no answers yet'}</td>
                                        <td>{moment(q.post_date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td>
                                            <p><span>
                                                <button
                                                    onClick={acceptQuestion}
                                                    value={q.id} className='btn btn-outline-success'>
                                            <i className='fa fa-check'> </i>
                                        </button>
                                            </span>
                                                <span><button
                                                    data-toggle="modal" data-target={'#QRejectingModal'+q.id}
                                                    className='btn btn-outline-danger'>
                                            <i className='fa fa-ban'> </i>
                                        </button>
                                                {/*start modal*/}
                                                    <div className="modal" id={'QRejectingModal'+q.id}>
                                       <div className="modal-dialog" >
                                           <div className="modal-content">
                                               <div className="modal-header">
                                                   <h4 className="modal-title">reject question</h4>
                                                   <button type="button" className="close"
                                                           data-dismiss="modal">&times;</button>
                                               </div>
                                               <div className="modal-body">
                                                   <form action="">
                                                  <textarea onChange={event => setRejectingReason(event.target.value)}
                                                      placeholder={'please type the rejecting reason'}
                                                      name="" id="" cols="30" rows="10"> </textarea>
                                                   <button
                                                       value={q.id}
                                                       onClick={rejectQuestion}
                                                       className={"btn btn-warning"}
                                                       type={"submit"}>
                                                       confirm
                                                   </button>
                                                   </form>
                                               </div>


                                               <div className="modal-footer">
                                                   <button type="button" className="btn btn-danger"
                                                           data-dismiss="modal">Close
                                                   </button>
                                               </div>

                                           </div>
                                       </div>
                                   </div>
                                                {/*finish modal*/}
                                                </span>
                                            </p>
                                        </td>
                                    </tr>
                                    :<></>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div  className="table-responsive">
                        <h3 className='' style={{'color':'rgb(142, 85, 142)'}}>checked questions</h3>
                        <table className='table   ' style={{'backgroundColor':'rgb(142, 85, 142)','color':'white'}}>
                            <thead>
                            <tr>
                                <th>topic</th>
                                <th>by</th>
                                <th>answers</th>
                                <th>created at</th>
                                <th>status</th>
                                <th>rejection reason</th>
                                <th>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questions.length === 0 ?
                                <tr><td colSpan={5}>
                                    <h3>no questions yet</h3>
                                </td></tr>
                                :
                                questions.map( (q, i)=>

                                    q.status!==null?
                                    <tr key={q.id.toString()}>
                                        <td><Link style={{'color':'white'}} to={'/questions/'+q.id}><b>{q.topic}</b></Link></td>
                                        <td><b>{q.name}</b></td>
                                        <td>{q.count_answers>0 ?q.count_answers+' answers':'no answers yet'}</td>
                                        <td>{moment(q.post_date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                        <td>{q.status===1?
                                            <span style={{'color':'#61e786'}}>
                                                accepted
                                            </span>
                                            :
                                            <span style={{'color':'#FFC145'}} >
                                                rejected
                                            </span>
                                        }</td>
                                        <td>
                                            {
                                                q.rejected_reason?
                                                 <p className={'text-light'}>{q.rejected_reason}</p>
                                                 :'-'
                                            }
                                        </td>
                                        <td>
                                            <span><button className='btn btn-outline-light'>
                                            <i className='fa fa-pencil'> </i>
                                        </button></span>
                                        {/*    <span><button className='btn btn-outline-danger'>*/}
                                        {/*    <i className='fa fa-ban'> </i>*/}
                                        {/*</button></span>*/}


                                        </td>
                                    </tr>
                                        :<></>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card">
                        <div className="card-header">ask a question</div>

                        <div className="card-body">
                            <input className='form-control' value={topic} disabled={loading}
                                   onChange={(e) => {
                                       setTopic(e.target.value)
                                   }}
                                   type="text"
                                   placeholder="please add a topic" required=""/>
                            <br/>
                            <RichTextEditor value={question} onChange={onChange}/>
                            <br/>
                            <button style={{'backgroundColor':'rgb(142, 85, 142)'}} className='btn btn-secondary btn-block' onClick={addQuestion}>
                                {loading ? <span>publishing...</span> : <span>publish</span>}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
    );
}
