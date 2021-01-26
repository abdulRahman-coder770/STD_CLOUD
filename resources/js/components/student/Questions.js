import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "./Navbar";
import ReactSummernote from 'react-summernote';
import RichTextEditor from "../Parts/RichTextEditor";
import parse from "html-react-parser"
import moment from 'moment'
import {Link, Redirect} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import {toast, ToastContainer} from "react-toastify";
import Footer from "./Footer";


export default function Questions() {
    if (!localStorage.getItem('token')){
        return <Redirect to='/roles'/>
    }
    if (localStorage.getItem('major_id')===''){
        return <Redirect to='/roles'/>
    }
    const [question, setQuestion] = useState('')
    let major_id=localStorage.getItem('major_id');
    let userId=localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);

    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionItem, setQuestionItem] = useState([]);
    const [progress, setProgress] = useState(0)
    const [search,setSearch]=useState('')
    const [recent_posts,setRecent_posts]=useState([])

    async function getQuestions() {
        await axios.post("http://localhost:8000/api/auth/students/getQuestions", {
            "major_id": major_id,
        })
            .then((res) => {
                    console.log(res.data.questions)
                    setQuestions(res.data.questions)
                setRecent_posts(res.data.recent_posts)
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
        channel.bind('question-status', function(data) {
            var question = data['question'];
            console.log(question)
            if (question.user_id == localStorage.getItem('userId')) {
                getQuestions();
                // setQuestions(prevState => [
                //     ...prevState, {...question[0]}]
                // )
                if (question.status===1)
                toast('your question has accepted, please check the notifications')
                if (question.status===0)
                    toast('your question has rejected, please check the notifications to know the reason')

            }
        })

        getQuestions();
        }
        , []);

    function searchQuestions(e){
        setSearch(e.target.value)
        let se=e.target.value;
        if (se==''){
            getQuestions()
            return
        }
        axios.post("http://localhost:8000/api/auth/students/questions/searchQuestions", {
            "se": se,
            'major_id':major_id
        })
            .then((res) => {
                console.log(res.data)
                setQuestions(res.data.questions)
                setProgress(100)
            })
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
                if (res.data.status==-1) {
                    if (res.data.user.is_active == 0) {
                        toast.error('your account is inactive please contact the admin')
                        setLoading(false)
                        return
                    }
                }
                setQuestion('')
                setTopic('')
                setLoading(false)
                toast('your question successfully added, please wait for admit ')
                console.log(res.data.question[0].name);
                }
            )
    }


    function onChange(content) {
        setQuestion(content);
    }
    // $(function () {
    //     $(document).scroll(function () {
    //         var $nav = $(".fixed-top");
    //         $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    //     });
    // });

    return (

        <div className="container-fluid">
            <ToastContainer />
            <LoadingBar
                color='#008DD5'
                height='5px'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Navbar/>
            <div className='row '>
                <div className='col-md-12 questions-header justify-content-center'>
                    <div id="color-overlay">
                        <center>
                        <div className='col-sm-4' style={{}} >
                            <h3  style={{'padding':'10px','color':'#2c343b !important',
                                'backgroundColor':'rgba(0, 0, 0,.1)','text-align':'center','position':'relative','top':'200px'}} className='text-light my-auto'>
                                {localStorage.getItem('major_name')} / {localStorage.getItem('uni_name')}
                            </h3>
                        </div>
                        </center>
                    </div>

                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-1"></div>
                <div className="col-md-8">

                    <div>
                        <form action="" className='form'>
                            <div className="form-group has-search">
                                <span className="fa fa-search form-control-feedback"></span>
                                <input  value={search} onChange={searchQuestions} type="text"
                                        placeholder={'search questions'}
                                        className="form-control"/>
                            </div>

                        </form>
                    </div>
                    <hr/>
                    {questions.length === 0 ?
                       <h3>no questions yet</h3>
                        :

                        questions.map( (q, i)=>
                            q.status==1?
                           <div className='questions' key={'q'+q.id}>
                                   <div className="card">
                                       <div className='card-header'>
                                           <span>{
                                               q.user.photo_path==null?
                                <span style={{'padding':'3px',
                                    'border':'0.5px solid white',
                                    'backgroundColor':'black',
                                    'width':'42px',
                                    'height':'42px',
                                    'display':'inline-block',
                                    'marginRight':'5px'
                                }} className='rounded-circle'>

                                    <h3 style={{'color':'#fff'}} className='text-center'>{q.name.charAt(0).toUpperCase()}</h3>


                                </span>
                                    :
                                                   <span style={{

                                                       'backgroundColor':'black',
                                                       'width':'44px',
                                                       'height':'44px',
                                                       'display':'inline-block',
                                                       'marginRight':'5px'
                                                   }} className='rounded-circle'>
                                                   <img
                                               style={{
                                                   'width':'100%',
                                                   'height':'100%'
                                               }} className='rounded-circle'

                                               src={'http://localhost:8000/photos/'+q.user.photo_path} alt=""/>
                                                   </span>
                                        }

                                           </span>
                                           <span><b>{q.name}</b></span>
                                           <span style={{'color':'rgba(255,255,255,.6)','fontSize':'12px'}} className='float-right text-sm-right'>
                                           {moment(q.post_date).add(2, 'hours').fromNow()}
                                       </span>
                                       </div>
                                       <div className='card-body'>
                                           <b>{q.topic}</b>
                                       </div>
                                       <div className='card-footer'>

                                           <span style={{'color':'rgba(255,255,255,.6)'}}>
                                           {q.count_answers>0 ?q.count_answers+' answers':'no answers yet'}
                                       </span>
                                             <span  className='float-right'>
                                           <Link style={{'color':'#fff'}} to={'/questions/'+q.id}>answer</Link>
                                       </span>

                                       </div>
                                   </div>

                               <br/><br/>
                           </div>
                                :<></>

                        )}


                    <div className="card">
                        <div  className="card-header">Ask a question</div>

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
                            <button style={{'backgroundColor':'#8E558E'}} className='btn btn-block btn-secondary' onClick={addQuestion}>
                                {loading ? <span>publishing...</span> : <span>publish</span>}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header">
                            <h5>Recent Questions</h5>
                        </div>
                        <div className="card-body">
                            {questions.map((r,i)=>
                                <p id={r.id.toString()}><Link to={'/questions/'+r.id}>{r.topic}</Link><hr/></p>
                            )
                            }
                        </div>
                    </div>
                    <br/>
                    <div className="card">
                        <div className="card-header">
                            <h5>Popular Posts</h5>
                        </div>
                        <div className="card-body">
                            {recent_posts.map((r,i)=>
                                <p id={r.id.toString()}><Link to={'/posts/'+r.id}>{r.title}</Link><hr/></p>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <Footer/>
            </div>
        </div>
    );
}
