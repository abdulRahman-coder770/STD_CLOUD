import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "./Navbar";
import ReactSummernote from 'react-summernote';
import RichTextEditor from "../Parts/RichTextEditor";
import parse from "html-react-parser"

import moment from 'moment'
import {toast, ToastContainer} from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import Reply from "./Reply";
import Footer from "./Footer";

export default function showPost(props) {

    const [post_id] = useState(props.match.params.id)
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState({})
    const [user, setUser] = useState({})

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [progress, setProgress] = useState(0)

    useEffect(() => {
            async function getPost() {
                setProgress(50)
                await axios.post("http://localhost:8000/api/auth/students/posts/getPost", {
                    'id': post_id
                })
                    .then((res) => {
                            console.log(res.data.post.user.name)
                            setPost(res.data.post)
                            setUser(res.data.post.user)
                            setComments(res.data.post.comments)
                            setProgress(100)
                        }
                    )
            }

            async function getComments() {
                await axios.post("http://localhost:8000/api/auth/students/posts/getComments", {
                    'id': post_id
                })
                    .then((res) => {
                            console.log(res.data.comments)
                            setComments(res.data.comments)
                        }
                    )
            }

            getPost();
            // getComments();
        }
        , []);

    function addComment() {
        setLoading(true)
        setProgress(40)
        axios.post("http://localhost:8000/api/auth/students/posts/addComment", {
            "user_id": localStorage.getItem('userId'),
            'body': comment,
            'post_id': post_id
        })
            .then((res) => {
                if (res.data.status==-1) {
                    if (res.data.user.is_active == 0) {
                        toast.error('your account is inactive please contact the admin')
                        setLoading(false)
                        setComment('')
                        setProgress(100)
                        return
                    }
                }
                    if (comments.length === 0) {
                        window.location = ''
                    } else {
                        comments.unshift(res.data.comment)
                        console.log(res.data.comment)
                    }
                    setComments(comments)
                    // setPosts(prevState => [
                    //     ...prevState,{...res.data.post[0]}]
                    // )
                    setComment('')
                    setProgress(100)
                    setLoading(false)
                }
            )
    }

    function AddReply(e) {
        e.preventDefault()
        let comment_id = e.target.value;

        let r = document.getElementById('reply' + comment_id);
        let body = r.value;

        axios.post("http://localhost:8000/api/auth/students/posts/addReply", {
            "user_id": localStorage.getItem('userId'),
            'body': body,
            'comment_id': comment_id
        })
            .then((res) => {
                console.log(res.data)
                r.value=''
                // $('#ulReplies'+comment_id).appendChild(<Reply data={res.data.reply} />)
                const itemIndex=comments.findIndex(i=>i.id===res.data.comment.id)
                comments[itemIndex]=res.data.comment
                setComments([...comments])
            })

    }


    function onChange(content) {
        setComment(content);
    }

    return (

        <div className="container-fluid">
            <ToastContainer/>
            <LoadingBar
                color='#008DD5'
                height='5px'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Navbar/>
            <br/>
            <br/><br/><br/><br/>
            <div className="row justify-content-center">
                <div className="col-md-1"></div>
                <div className="col-md-8" style={{'box-shadow':'1px 1px 1px 1px rgba(0,0,0,.2)'}}>
                    <div>

                        <p><b><span className='text-primary'>posted by {user.name} </span>
                            <span className='float-right text-primary'>
                                {moment(post.created_at).format('MMMM Do YYYY')}
                            </span></b></p>
                        <div style={{'backgroundColor': 'white !important', 'fontWeight':'bold','width': '100%', 'height': 'auto'}}>
                            <h2 className='text-center'>
                                {post.title}
                            </h2>
                            {post.header_path ?
                                <div
                                    style={{
                                        'padding': '2px',
                                        'width': '100%',
                                    }}
                                >
                                    : <img
                                    style={{
                                        'padding': '2px',
                                        'width': '100%',
                                        'height':'500px'
                                    }}
                                    className='rounded'

                                    src={'http://localhost:8000/post_headers/' + post.header_path}
                                    alt=""/>

                                </div> : <></>
                            }
                            <div>
                                <br/>
                                <div className='q-body text-muted' dangerouslySetInnerHTML={{__html: post.body}}>

                                </div>
                            </div>

                        </div>
                        <hr/>
                        <h3 >Comments({post.count_comments})</h3>
                        <br/>
                        <ul className='comments'>
                            {post.count_comments == 0 ?
                                <h3 className='text-light'>no comments yet</h3>
                                :
                                comments.map((com, i) =>
                                    <li key={com.id.toString()}>
                                        <div className='card'>
                                            <div className='card-header'>
                                                       <span>{
                                                           com.photo_path == null ?
                                                               <div style={{
                                                                   'padding': '2px',
                                                                   'border': '0.5px solid white',
                                                                   'backgroundColor': 'black',
                                                                   'width': '40px',
                                                                   'height': '40px',
                                                                   'display': 'inline-block',
                                                                   'marginRight': '5px'
                                                               }} className='rounded-circle'>

                                                                   <h3 className='text-light text-center'>{com.user_name.charAt(0).toUpperCase()}</h3>
                                                               </div>
                                                               : <img
                                                                   style={{
                                                                       'padding': '2px',
                                                                       'width': '50px',
                                                                       'height': '50px'
                                                                   }} className='rounded-circle'

                                                                   src={'http://localhost:8000/photos/' + com.user.photo_path}
                                                                   alt=""/>
                                                       }
                                           </span>
                                                <b><span className='text-light'> {com.user.name}</span></b>
                                                <span className='float-right text-light'>
                                                {moment(com.created_at).fromNow()}
                                            </span>
                                            </div>

                                            <div className='card-body'>
                                                <div style={{

                                                    'marginLeft': '10px'
                                                }} dangerouslySetInnerHTML={{__html: com.body}}>

                                                </div>
                                            </div>
                                            <div className='card-footer'>
                                                <div>
                                        <span className='float-left'>
                                            <span
                                                data-toggle="collapse" data-target={"#ComReplies" + com.id}
                                                aria-expanded="false"
                                                aria-controls={"ComReplies" + com.id}
                                                className='text-light btn btn-link'>
                                                {com.replies.length > 0 ? com.replies.length + ' replies' : ''}
                                            </span>
                                        </span>
                                                    <span className='pull-right'>
                                            <button
                                                data-toggle="collapse" data-target={"#formReply" + com.id}
                                                aria-expanded="false"
                                                aria-controls={"formReply" + com.id}
                                                style={{'color': 'rgba(255,255,255,1)'}}
                                                className='btn btn-link'>Reply</button>
                                        </span>
                                                </div>

                                                <div className='collapse' id={"ComReplies" + com.id}>
                                                    <br/><br/>
                                                    <ul id={'ulReplies' + com.id}>
                                                        {com.replies.length < 1 ?
                                                            <></>
                                                            :
                                                            com.replies.map((r, i) =>
                                                                // <Reply data={r} />
                                                                    <li key={r.id.toString()}>
                                                                        <div style={{'height':'auto !important',
                                                                            'border':'0.5px solid rgba(255,255,255,0.1)',
                                                                            'borderRadius':'5%'
                                                                        }}  className='row'>
                                                                            <div style={{
                                                                                'display':'inline-block',
                                                                                'padding':'5px',
                                                                                'marginRight':'2px',


                                                                            }} className='col-md-2'>
                                                                               <span>{
                                                                                   r.photo_path == null ?
                                                                                       <div style={{
                                                                                           'padding': '2px',
                                                                                           'border': '0.5px solid white',
                                                                                           'backgroundColor': 'black',
                                                                                           'width': '40px',
                                                                                           'height': '40px',
                                                                                           'display': 'inline-block',
                                                                                           'marginRight': '5px'
                                                                                       }} className='rounded-circle'>

                                                                                           <h3 className='text-light text-center'>{r.user_name.charAt(0).toUpperCase()}</h3>


                                                                                       </div>
                                                                                       : <img
                                                                                           style={{
                                                                                               'padding': '2px',
                                                                                               'width': '50px',
                                                                                               'height': '50px'
                                                                                           }} className='rounded-circle'

                                                                                           src={'http://localhost:8000/photos/' + r.user.photo_path}
                                                                                           alt=""/>
                                                                               }
                                                                         </span>
                                                                                <p className='text-light' style={{'fontSize':'12px'}}>
                                                                                    <b>{r.user.name}</b>

                                                                                </p>
                                                                                <p><span style={{'fontSize':'12px'}} className='text-success'>
                                                                                        {moment(r.created_at).fromNow()}
                                                                                 </span></p>
                                                                            </div>
                                                                            <div style={{'display':'inline-block',
                                                                                'paddingTop':'10px',
                                                                                // 'border': '0.5px solid rgba(0,0,0,.1)',
                                                                                // 'backgroundColor':'white',
                                                                                'height':'auto',

                                                                            }} className='col-md-8'>
                                                                                <span className='text-light' style={{'fontSize':'16px'}} >{r.body}</span>

                                                                            </div>



                                                                        </div>
                                                                        <br/>
                                                                    </li>
                                                            )}
                                                    </ul>
                                                </div>

                                                <div className="collapse" id={"formReply" + com.id}>
                                                    <form className='form' action="">
                                                        <div className='form-group'>
                                                            <input id={'reply' + com.id} className='form-control'
                                                                   type="text"/>
                                                            <button onClick={AddReply} value={com.id}
                                                                    className='btn btn-primary'>send
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <br/><br/>

                                    </li>
                                )}
                        </ul>
                    </div>

                    <h1><br/></h1>
                    <div className="card">
                        <div className="card-header">New Comment</div>

                        <div className="card-body">
                            <RichTextEditor value={comment} onChange={onChange}/>
                            <br/>
                            <button style={{'backgroundColor':'#8E558E'}} className='btn btn-secondary btn-block' onClick={addComment}>
                                {loading ? <span>publishing...</span> : <span>publish</span>}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header justify-content-center">
                            <p className='text-light text-center'>Author</p>
                            <img className='rounded-circle' width='90%' height={200} src={'http://localhost:8000/photos/' + user.photo_path} alt=""/>
                            <h4>{user.name}</h4>
                        </div>
                        <div style={{'backgroundColor':'#8E558E'}} className="card-body">
                            <p className='text-light'>
                                University: {post.uni}
                            </p>
                            <p className='text-light'>
                                Major: {post.major}
                            </p>
                            <p style={{'fontSize':'14px'}} className='text-light'>{user.about}</p>
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
