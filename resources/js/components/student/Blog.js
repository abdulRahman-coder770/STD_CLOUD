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
import avatar from "../images/avatar.png";
import $ from "jquery";
import Footer from "./Footer";


export default function Blogger() {
    if (!localStorage.getItem('token')){
        return <Redirect to='/roles'/>
    }
    if (localStorage.getItem('major_id')===''){
        return <Redirect to='/roles'/>
    }
    const [post, setPost] = useState('')
    const [recentPosts, setRecentPosts] = useState([])
    const [recentQuestions, setRecentQuestions] = useState([])
    let major_id=localStorage.getItem('major_id');
    let userId=localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0)
    const [topic, setTopic] = useState('');
    const [posts, setPosts] = useState([]);
    const [postItem, setPostItem] = useState([]);

    const [search,setSearch]=useState('')

    async function getPosts() {
        await axios.post("http://localhost:8000/api/auth/students/posts/getPosts")
            .then((res) => {
                    console.log(res.data.posts)
                    setPosts(res.data.posts)
                    setRecentPosts(res.data.recents)
                    setRecentQuestions(res.data.recent_questions)
                    setProgress(100)


                }
            )
    }
    useEffect(() => {

            getPosts();
        }
        , []);

    function searchPosts(e){
        setSearch(e.target.value)
        let se=e.target.value;
        if (se==''){
            getPosts()
            return
        }
        axios.post("http://localhost:8000/api/auth/students/posts/searchPosts", {
            "se": se,
            'major_id':major_id
        })
            .then((res) => {
                console.log(res.data)
                setPosts(res.data.posts)
                setProgress(100)
            })
    }

    function addPost(e) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();

        let sfiles = document.getElementById("input_preview").files
        formData.append("file", sfiles[0]);
        formData.append("user_id", localStorage.getItem('userId'));
        formData.append("body", post);
        formData.append("title", topic);
        axios.post("http://localhost:8000/api/auth/students/posts/addPost", formData,
            {
                headers: {'content-type': 'multipart/form-data',
                    "Access-Control-Allow-Origin": "*"
                },
            }
            )
            .then((res) => {
                if (res.data.status==-1) {
                    if (res.data.user.is_active == 0) {
                        toast.error('your account is inactive please contact the admin')
                        setLoading(false)
                        return
                    }
                }
                    setPost('')
                    setTopic('')
                getPosts()
                reset()
                setLoading(false)
                $('#exampleModalPreview').modal('hide');
                    toast('your post successfully added ')
                    console.log(res.data.post);
                }
            )
    }

    function onChange(content) {
        setPost(content);
    }
    function reset() {
        setPost('');
        setTopic('');
        var image = document.getElementById('img_preview');
        image.setAttribute('src',avatar) ;
    }

    function handleChangeImg(event){
        var image = document.getElementById('img_preview');
        image.setAttribute('src',URL.createObjectURL(event.target.files[0])) ;
        // console.log(URL.createObjectURL(event.target.files[0]))
        // setPhoto( URL.createObjectURL(event.target.files[0]))
    }
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
                <div className='col-md-12 posts-header justify-content-center'>
                    <div id="color-overlay">
                        <center>
                            <div className='col-sm-4' style={{}} >
                                <p  style={{'padding':'10px','color':'#2c343b !important',
                                    'position':'relative','top':'200px'}} className='text-light'>
                                    <button style={{'opacity':'.9','backgroundColor':'rgb(142, 85, 142)','color':'white'}}
                                            id="modalActivate" type="button"
                                            className="btn btn-default btn-block"
                                            data-toggle="modal" data-target="#exampleModalPreview">
                                        <span>New Post <i className='fa fa-pencil'></i></span>
                                    </button>

                                    <div className="modal fade right" id="exampleModalPreview" tabIndex="-1"
                                         role="dialog" aria-labelledby="exampleModalPreviewLabel" aria-hidden="true">
                                        <div className="modal-dialog-full-width modal-dialog momodel modal-fluid"
                                             role="document">
                                            <div className="modal-content-full-width modal-content ">
                                                <div className=" modal-header-full-width   modal-header">
                                                    <h3 className="modal-title w-100"
                                                        style={{'color':'#8E558E !important'}}
                                                        id="exampleModalPreviewLabel">New Post with preview</h3>
                                                    <button type="button" className="close " data-dismiss="modal"
                                                            aria-label="Close">
                                                        <span style={{"font-size":" 1.3em"}}
                                                              aria-hidden="true">x</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className='row'>
                                                        <div  className='col-sm-6 text-md-left'>
                                                            <div className="card">
                                                                <div  className="card-header">Add a post</div>

                                                                <div className="card-body">
                                                                <form>
                                                                    <div className={'form-group'}>
                                                                        <input id='input_preview' type="file" accept="image/*"
                                                                               onChange={handleChangeImg}
                                                                               className='form-control'/>
                                                                    </div>
                                                                    <input className='form-control' value={topic} disabled={loading}
                                                                           onChange={(e) => {
                                                                               setTopic(e.target.value)
                                                                           }}
                                                                           type="text"
                                                                           placeholder="please add a topic" required=""/>
                                                                    <br/>
                                                                    <RichTextEditor value={post} onChange={onChange}/>
                                                                    <br/>
                                                                    <button
                                                                        style={{'backgroundColor':'#8E558E'}}
                                                                        className='btn btn-secondary btn-block' onClick={addPost}>
                                                                        {loading ? <span>publishing...</span> : <span>publish</span>}
                                                                    </button>
                                                                    <br/>
                                                                    <button onClick={reset
                                                                    } className='btn btn-danger btn-block' type='reset'>
                                                                        reset
                                                                    </button>
                                                                </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-sm-6 preview'>
                                                            <div   style={{'padding':'2px',

                                                            }} className='row rounded-circle'>

                                                                        <img id='img_preview'
                                                                             style={{'padding':'2px',
                                                                                 'border':'0.5px solid white',
                                                                                 'backgroundColor':'black',
                                                                                 'width':'90%',
                                                                                 'height':'400px'

                                                                             }} className='rounded'

                                                                             src={avatar} alt=""/>

                                                            </div>
                                                            <div style={{'color':'black !important'}}>
                                                                <h2 style={{'color':'black'}}>{topic}</h2>
                                                            </div>
                                                            <div className={'text-md-left'}>
                                                                <div  dangerouslySetInnerHTML={{ __html:post }}></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="modal-footer-full-width  modal-footer">
                                                    <button type="button" className="btn btn-danger btn-md btn-rounded"
                                                            data-dismiss="modal">Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </p>
                            </div>
                        </center>
                    </div>

                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-1"></div>
                <div className="col-md-8">

                    <div style={{'paddingLeft':'15px','paddingRight':'15px'}}>
                        <form action="" className='form'>
                            <div className="form-group">
                                <input value={search} onChange={searchPosts} type="text"
                                       placeholder={'search posts'}
                                       className="form-control"/>
                            </div>
                        </form>
                    </div>
                    <hr/>
                    {posts.length === 0 ?
                        <h3 className='text-light'>no posts yet</h3>
                        :
                        posts.map( (q, i)=>

                                <div className='posts col-md-6'  key={'q'+q.id}>
                                    <div className="card">
                                        <div className='card-header'>
                                           <span>{
                                               q.user.photo_path==null?
                                                   <span style={{'padding':'1px',
                                                       'border':'0.5px solid white',
                                                       'backgroundColor':'black',
                                                       'width':'42px',
                                                       'height':'42px',
                                                       'display':'inline-block',
                                                       'marginRight':'5px'
                                                   }} className='rounded-circle'>

                                    <h3 className='text-danger text-center'>{q.user.name.charAt(0).toUpperCase()}</h3>


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
                                            <span><b>{q.user.name}</b></span>
                                            <span style={{'color':'rgba(255,255,255,.7)','fontSize':'12px'}} className='float-right text-sm-right'>
                                           {moment(q.created_at).fromNow()}
                                       </span>
                                        </div>
                                        <div style={{'minHeight':'200px'}} className='card-body'>
                                            <h5><b>{q.title}</b></h5>
                                            {q.header_path?
                                                <div className='rounded'>
                                                    <img width={'100%'} height={200} src={'http://localhost:8000/post_headers/'+q.header_path} alt=""/>
                                                </div>:
                                                <></>

                                            }

                                        </div>
                                        <div className='card-footer'>

                                           <span style={{'color':'rgba(255,255,255,.7)'}} className='text-sm'>
                                           {q.comments.length>0 ?q.comments.length+' comments':'no comments'}
                                       </span>
                                            <span  className='float-right text-sm'>
                                           <Link style={{'color':'white'}} to={'/posts/'+q.id}>Read more</Link>
                                       </span>

                                        </div>
                                    </div>


                                </div>


                        )}



                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header">
                            <h5>Recent Posts</h5>
                        </div>
                        <div className="card-body">
                            {recentPosts.map((r,i)=>
                                <p id={r.id.toString()}><Link to={'/posts/'+r.id}>{r.title}</Link><hr/></p>

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
                            {recentPosts.map((r,i)=>
                                <p id={r.id.toString()}><Link to={'/posts/'+r.id}>{r.title}</Link><hr/></p>
                            )
                            }
                        </div>
                    </div>
                    <br/>
                    <div className="card">
                        <div className="card-header">
                            <h5>Recent Questions</h5>
                        </div>
                        <div className="card-body">
                            {recentQuestions.map((r,i)=>
                                <p id={r.id.toString()}><Link to={'/questions/'+r.id}>{r.topic}</Link><hr/></p>
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
