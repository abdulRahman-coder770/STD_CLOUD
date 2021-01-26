import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "./Navbar";
import ReactSummernote from 'react-summernote';
import RichTextEditor from "../Parts/RichTextEditor";
import parse from "html-react-parser"

import moment from 'moment'
import Footer from "./Footer";
import {toast, ToastContainer} from "react-toastify";

export default function showQuestion(props) {

    const [question_id] = useState(props.match.params.id)
    const [userId]=localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('')

    const [answer, setAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    async function getQuestion() {
        await axios.post("http://localhost:8000/api/auth/students/getQuestion", {
            'id':question_id
        })
            .then((res) => {
                    console.log(res.data)
                    setQuestion(res.data.question[0])
                }
            )
    }
    async function getAnswers() {
        await axios.post("http://localhost:8000/api/auth/students/question/getAnswers", {
            'question_id':question_id
        })
            .then((res) => {
                    console.log(res.data.answers)
                    setAnswers(res.data.answers)
                }
            )
    }
    useEffect(() => {

            getQuestion();
            getAnswers();
        }
        , []);

    function addAnswer() {
        setLoading(true)

        axios.post("http://localhost:8000/api/auth/students/questions/addAnswer", {
            "user_id": localStorage.getItem('userId'),
            'body': answer,
            'question_id': question_id
        })
            .then((res) => {
                if (res.data.status==-1) {
                    if (res.data.user.is_active == 0) {
                        toast.error('your account is inactive please contact the admin')
                        setLoading(false)
                        return
                    }
                }
                if (answers.length===0){
                    getQuestion()
                    getAnswers()
                    setLoading(false)
                    setAnswer('')
                    return
                }

                else {
                    answers.unshift(res.data.answer[0])
                    setAnswers(answers)
                    setAnswer('')
                    setLoading(false)
                }

                }
            )
    }


    function onChange(content) {
        setAnswer(content);
    }

    return (

        <div className="container-fluid">
            <ToastContainer />
            <Navbar/>
            <br/>
            <br/><br/><br/><br/>
            <div className="row justify-content-center">
                <div className="col-md-1"></div>
                <div className="col-md-8">
                    <div>
                        <h2 className=' '>
                            {question.topic}
                        </h2>
                        <p><b><span className='text-primary'>asked by {question.name}</span>
                            <span className='float-right text-primary'>
                                {moment(question.post_date).format('MMMM Do YYYY')}
                            </span></b></p>
                        <hr/>
                        <div style={{'backgroundColor':'white !important','width':'100%','height':'auto'}}>
                        <div className='q-body'  dangerouslySetInnerHTML={{ __html: question.body }}>

                        </div>
                        </div>
                        <hr/>
                        <h3 className=''>Answers({answers.length})</h3>
                        <br/>
                        <div className='answers'>
                            {question.count_answers == 0 ?
                                <h3 className=' '>no answers yet</h3>
                                :
                                answers.map( (ans, i)=>
                                    <div  key={ans.id}>
                                        <p>
                                                       <span>{
                                                           ans.photo_path==null?
                                                               <div style={{'padding':'3px',
                                                                   'border':'0.5px solid white',
                                                                   'backgroundColor':'black',
                                                                   'width':'40px',
                                                                   'height':'40px',
                                                                   'display':'inline-block',
                                                                   'marginRight':'5px'
                                                               }} className='rounded-circle'>

                                                                   <h3 className='text-light text-center'>{ans.name.charAt(0).toUpperCase()}</h3>


                                                               </div>
                                                               : <img
                                                                   style={{'padding':'2px',
                                                                       'width':'50px',
                                                                       'height':'50px'
                                                                   }} className='rounded-circle'

                                                                   src={'http://localhost:8000/photos/'+ans.photo_path} alt=""/>
                                                       }
                                           </span>
                                            <b><span className=' ' > {ans.name}</span></b>
                                            <span className='float-right text-primary text-sm-right'>
                                                {moment(ans.post_date).fromNow()}
                                            </span>
                                        </p>
                                        <div className='q-body' dangerouslySetInnerHTML={{ __html: ans.body }}>

                                        </div>
                                    </div>


                                )}
                        </div>
                    </div>

                    <h1> <br/></h1>
                    {
                        question.status=='1'?
                            <div className="card">
                                <div className="card-header">add your answer</div>

                                <div className="card-body">
                                    <RichTextEditor value={answer} onChange={onChange}/>
                                    <br/>
                                    <button style={{'backgroundColor':'#8E558E'}} className='btn btn-secondary btn-block' onClick={addAnswer}>
                                        {loading ? <span>publishing...</span> : <span>publish</span>}
                                    </button>
                                </div>
                            </div>:
                            <h1 className='text-danger'>this question is rejected</h1>

                    }
                </div>

                <div className="col-md-3"></div>
            </div>
            <div className="row">
                <Footer/>
            </div>
        </div>
    );
}
