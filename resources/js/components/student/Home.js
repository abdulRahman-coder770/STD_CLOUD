import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from "react-router-dom";
import {Navbar} from "./Navbar";
import Footer from "./Footer";
import moment from "moment";

export default function Home() {
    const [logged] = useState(JSON.parse(localStorage.getItem('logged')))
    // window.addEventListener('storage', function(e) {
    if (!logged) {
        return <Redirect to='/roles'/>
    }

    const [posts, setPosts] = useState([])
    const [recentPosts, setRecentPosts] = useState([])
    const [recentQuestions, setRecentQuestions] = useState([])
    let major_id=localStorage.getItem('major_id');
    let userId=localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0)

    // });
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
    return (
        <div className="container-fluid">
            <Navbar/>
            <div className="row justify-content-center">
                <div className="col-md-12 home-header">
                    <div id="color-overlay">
                        <div  style={{}} >
                            <h1  style={{'color':'#2c343b !important',
                                'position':'relative','top':'200px'}} className='text-light text-center'>
                                Welcome To Your Cloud
                            </h1>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className='text-center' style={{'color':'#f73859'}}>
                        About Us
                    </h1>
                    <div className='justify-content-center'>
                        <br/>
                        <h5 className='text-center text-light'>
                            We help make students education journey easier
                        </h5>
                    </div>
                </div>

            </div>
            <br/>
            <br/>
            <div className='row justify-content-center'>
                <div className='row'>
                    <h3 className='text-center text-danger'>
                        Popular Posts
                    </h3>
                </div>

                <div style={{'marginTop':'40px'}} className="row justify-content-center">

                {
                posts.map( (q, i)=>

                <div className='posts col-md-3'  key={'q'+q.id}>
                    <div className="card">
                        <div className='card-header'>

                        </div>
                        <div style={{'minHeight':'200px'}} className='card-body'>
                            <h6><b>{q.title}</b></h6>
                            {q.header_path?
                                <div className='rounded'>
                                    <img width={'100%'} height={200} src={'http://localhost:8000/post_headers/'+q.header_path} alt=""/>
                                </div>:
                                <></>

                            }

                        </div>
                        <div className='card-footer'>

                                           <span className='text-sm'>
                                           {q.comments.length>0 ?q.comments.length+' comments':'15 comments'}
                                       </span>
                            <span  className='float-right text-sm'>
                                           <Link style={{'color':'rgb(247, 56, 89)'}} to={'/posts/'+q.id}>Read more</Link>
                                       </span>

                        </div>
                    </div>


                </div>

                )}
                </div>
            </div>
            <div className="row">

            </div>
            <Footer/>
        </div>
    );
}
