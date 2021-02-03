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
            <br/>
            <br/>
            <br/>

            <section id="home" className="parallax-section">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-md-6 col-sm-6">
                            <div className="home-img"></div>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className="home-thumb">
                                <div className="section-title">
                                    <h4 className="wow fadeInUp" data-wow-delay="0.3s">welcome to my website</h4>
                                    <h1 className="wow fadeInUp" data-wow-delay="0.6s">Hello, I
                                        am <strong>Stimulus</strong> currently based in New York city.</h1>
                                    <p className="wow fadeInUp" data-wow-delay="0.9s">Donec auctor arcu at efficitur
                                        lacinia. Praesent bibendum efficitur ipsum, et mattis tellus interdum in. Ut a
                                        dictum purus. Vestibulum non pellentesque felis, sed dignissim urna. Vestibulum
                                        id accumsan quam.</p>

                                    <a href="#about" className="wow fadeInUp smoothScroll section-btn btn btn-success"
                                       data-wow-delay="1.4s">Get Started</a>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>




            <section id="about" className="parallax-section">
                <div className="container">
                    <div className="row">

                        <div className="col-md-6 col-sm-12">
                            <div className="about-thumb">
                                <div className="wow fadeInUp section-title" data-wow-delay="0.4s">
                                    <h1>Donec auctor</h1>
                                    <p className="color-yellow">Sed vulputate vitae diam quis bibendum</p>
                                </div>
                                <div className="wow fadeInUp" data-wow-delay="0.8s">
                                    <p>Phasellus vulputate tellus nec tortor varius elementum. Curabitur at pulvinar
                                        ante. Duis dui urna, faucibus eget felis eu, iaculis congue sem. Mauris
                                        convallis eros massa.</p>
                                    <p>Quisque viverra iaculis aliquam. Etiam volutpat, justo non aliquam bibendum, sem
                                        nibh mollis erat, quis porta odio odio at velit.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="background-image about-img"></div>
                        </div>

                        <div className="col-md-3 col-sm-6" style={{'backgroundColor':'#d6b0b1'}}>
                            <div className="skill-thumb">
                                <div className="wow fadeInUp section-title color-white" data-wow-delay="1.2s">
                                    <h1>My Skills</h1>
                                    <p className="color-white">Photoshop . HTML CSS JS . Web Design</p>
                                </div>

                                <div className=" wow fadeInUp skills-thumb" data-wow-delay="1.6s">
                                    <strong>Frontend Design</strong>
                                    <span className="color-white pull-right">90%</span>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-primary" role="progressbar"
                                             aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"
                                             style={{"width":" 90%"}}></div>
                                    </div>

                                    <strong>Backend processing</strong>
                                    <span className="color-white pull-right">70%</span>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-primary" role="progressbar"
                                             aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
                                             style={{"width":" 70%"}}></div>
                                    </div>

                                    <strong>HTML5 & CSS3</strong>
                                    <span className="color-white pull-right">80%</span>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-primary" role="progressbar"
                                             aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"
                                             style={{"width":" 80%"}}> </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>




            <section id="service" className="parallax-section">
                <div className="container">
                    <div className="row">

                        <div className="bg-yellow col-md-3 col-sm-6">
                            <div className="wow fadeInUp color-white service-thumb" data-wow-delay="0.8s">
                                <i className="fa fa-desktop"></i>
                                <h3>Interface Design</h3>
                                <p className="color-white">Phasellus vulputate tellus nec tortor varius elementum.
                                    Curabitur at pulvinar ante.</p>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="wow fadeInUp color-white service-thumb" data-wow-delay="1.2s">
                                <i className="fa fa-paper-plane"></i>
                                <h3>Media Strategy</h3>
                                <p className="color-white">Curabitur at pulvinar ante. Duis dui urna, faucibus eget
                                    felis eu, iaculis congue sem.</p>
                            </div>
                        </div>

                        <div className="bg-dark col-md-3 col-sm-6">
                            <div className="wow fadeInUp color-white service-thumb" data-wow-delay="1.6s">
                                <i className="fa fa-table"></i>
                                <h3>Mobile App</h3>
                                <p className="color-white">Mauris convallis eros massa, vitae euismod arcu tempus ut.
                                    Quisque viverra iaculis.</p>
                            </div>
                        </div>

                        <div className="bg-white col-md-3 col-sm-6">
                            <div className="wow fadeInUp service-thumb" data-wow-delay="1.8s">
                                <i className="fa fa-html5"></i>
                                <h3>Coding</h3>
                                <p>Mauris convallis eros massa, vitae euismod arcu tempus ut. Quisque viverra
                                    iaculis.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>



            <section id="experience" className="parallax-section">
                <div className="container">
                    <div className="row">

                        <div className="col-md-6 col-sm-6">
                            <div className="background-image experience-img"></div>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className="color-white experience-thumb">
                                <div className="wow fadeInUp section-title" data-wow-delay="0.8s">
                                    <h1>My Experiences</h1>
                                    <p className="color-white">Previous companies and my tasks</p>
                                </div>

                                <div className="wow fadeInUp color-white media" data-wow-delay="1.2s">
                                    <div className="media-object media-left">
                                        <i className="fa fa-laptop"></i>
                                    </div>
                                    <div className="media-body">
                                        <h3 className="media-heading">Graphic Designer <small>2014 Jul - 2015
                                            Sep</small></h3>
                                        <p className="color-white">Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit.</p>
                                    </div>
                                </div>

                                <div className="wow fadeInUp color-white media" data-wow-delay="1.6s">
                                    <div className="media-object media-left">
                                        <i className="fa fa-laptop"></i>
                                    </div>
                                    <div className="media-body">
                                        <h3 className="media-heading">Web Designer <small>2015 Oct - 2017 Jan</small>
                                        </h3>
                                        <p className="color-white">Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>




            <section id="education" className="parallax-section">
                <div className="container">
                    <div className="row">

                        <div className="col-md-6 col-sm-6">
                            <div className="color-white education-thumb">
                                <div className="wow fadeInUp section-title" data-wow-delay="0.8s">
                                    <h1>My Education</h1>
                                    <p className="color-white">In cursus orci non ipsum gravida dignissim</p>
                                </div>

                                <div className="wow fadeInUp color-white media" data-wow-delay="1.2s">
                                    <div className="media-object media-left">
                                        <i className="fa fa-laptop"></i>
                                    </div>
                                    <div className="media-body">
                                        <h3 className="media-heading">Master in Design <small>2012 Jan - 2014
                                            May</small></h3>
                                        <p className="color-white">Etiam iaculis elit in mauris ullamcorper auctor.
                                            Proin a sapien id orci ullamcorper dignissim eu in neque. </p>
                                    </div>
                                </div>

                                <div className="wow fadeInUp color-white media" data-wow-delay="1.6s">
                                    <div className="media-object media-left">
                                        <i className="fa fa-laptop"></i>
                                    </div>
                                    <div className="media-body">
                                        <h3 className="media-heading">Bachelor of Arts <small>2008 May - 2011
                                            Dec</small></h3>
                                        <p className="color-white">Orci varius natoque penatibus et magnis dis
                                            parturient montes, nascetur ridiculus mus.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className="background-image education-img"></div>
                        </div>

                    </div>
                </div>
            </section>




            <section id="quotes" className="parallax-section">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">

                        <div className="col-md-offset-1 col-md-10 col-sm-12">
                            <i className="wow fadeInUp fa fa-star" data-wow-delay="0.6s"></i>
                            <h2 className="wow fadeInUp" data-wow-delay="0.8s">Proin lobortis eu diam et facilisis.
                                Fusce nisi nibh, molestie in vestibulum quis, auctor et orci.</h2>
                            <p className="wow fadeInUp" data-wow-delay="1s">Curabitur at pulvinar ante. Duis dui urna,
                                faucibus eget felis eu, iaculis congue sem.</p>
                        </div>

                    </div>
                </div>
            </section>




            <section id="contact" className="parallax-section">
                <div className="container">
                    <div className="row">

                        <div className="col-md-6 col-sm-12">
                            <div className="contact-form">
                                <div className="wow fadeInUp section-title" data-wow-delay="0.2s">
                                    <h1 className="color-white">Say hello..</h1>
                                    <p className="color-white">Integer ut consectetur est. In cursus orci non ipsum
                                        gravida dignissim.</p>
                                </div>

                                <div id="contact-form">
                                    <form action="#template-mo" method="post">
                                        <div className="wow fadeInUp" data-wow-delay="1s">
                                            <input name="fullname" type="text" className="form-control" id="fullname"
                                                   placeholder="Your Name"/>
                                        </div>
                                        <div className="wow fadeInUp" data-wow-delay="1.2s">
                                            <input name="email" type="email" className="form-control" id="email"
                                                   placeholder="Your Email"/>
                                        </div>
                                        <div className="wow fadeInUp" data-wow-delay="1.4s">
                                            <textarea name="message" rows="5" className="form-control" id="message"
                                                      placeholder="Write your message..."></textarea>
                                        </div>
                                        <div className="wow fadeInUp col-md-6 col-sm-8" data-wow-delay="1.6s">
                                            <input name="submit" type="submit" className="form-control" id="submit"
                                                   value="Send"/>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="background-image contact-img"></div>
                        </div>

                        <div className="bg-dark col-md-3 col-sm-6">
                            <div className="contact-thumb">
                                <div className="wow fadeInUp contact-info" data-wow-delay="0.6s">
                                    <h3 className="color-white">Visit my office</h3>
                                    <p>456 New Street 22000, New York City, USA</p>
                                </div>

                                <div className="wow fadeInUp contact-info" data-wow-delay="0.8s">
                                    <h3 className="color-white">Contact.</h3>
                                    <p><i className="fa fa-phone"></i> 01-0110-0220</p>
                                    <p><i className="fa fa-envelope-o"></i> <a
                                        href="mailto:hello@company.co">hello@company.co</a></p>
                                    <p><i className="fa fa-globe"></i> <a href="#">company.co</a></p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/*<div className="row justify-content-center">*/}
            {/*    <div className="col-md-12 home-header">*/}
            {/*        <div id="color-overlay">*/}
            {/*            <div  style={{}} >*/}
            {/*                <h1  style={{'color':'#2c343b !important',*/}
            {/*                    'position':'relative','top':'200px'}} className='text-light text-center'>*/}
            {/*                    Welcome To Your Cloud*/}
            {/*                </h1>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <h1 className='text-center' style={{'color':'#f73859'}}>*/}
            {/*            About Us*/}
            {/*        </h1>*/}
            {/*        <div className='justify-content-center'>*/}
            {/*            <br/>*/}
            {/*            <h5 className='text-center text-light'>*/}
            {/*                We help make students education journey easier*/}
            {/*            </h5>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*</div>*/}
            {/*<br/>*/}
            {/*<br/>*/}
            {/*<div className='row justify-content-center'>*/}
            {/*    <div className='row'>*/}
            {/*        <h3 className='text-center text-danger'>*/}
            {/*            Popular Posts*/}
            {/*        </h3>*/}
            {/*    </div>*/}

            {/*    <div style={{'marginTop':'40px'}} className="row justify-content-center">*/}

            {/*    {*/}
            {/*    posts.map( (q, i)=>*/}

            {/*    <div className='posts col-md-3'  key={'q'+q.id}>*/}
            {/*        <div className="card">*/}
            {/*            <div className='card-header'>*/}

            {/*            </div>*/}
            {/*            <div style={{'minHeight':'200px'}} className='card-body'>*/}
            {/*                <h6><b>{q.title}</b></h6>*/}
            {/*                {q.header_path?*/}
            {/*                    <div className='rounded'>*/}
            {/*                        <img width={'100%'} height={200} src={'http://localhost:8000/post_headers/'+q.header_path} alt=""/>*/}
            {/*                    </div>:*/}
            {/*                    <></>*/}

            {/*                }*/}

            {/*            </div>*/}
            {/*            <div className='card-footer'>*/}

            {/*                               <span className='text-sm'>*/}
            {/*                               {q.comments.length>0 ?q.comments.length+' comments':'15 comments'}*/}
            {/*                           </span>*/}
            {/*                <span  className='float-right text-sm'>*/}
            {/*                               <Link style={{'color':'rgb(247, 56, 89)'}} to={'/posts/'+q.id}>Read more</Link>*/}
            {/*                           </span>*/}

            {/*            </div>*/}
            {/*        </div>*/}


            {/*    </div>*/}

            {/*    )}*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="row">*/}

            {/*</div>*/}
            <Footer/>
        </div>
    );
}
