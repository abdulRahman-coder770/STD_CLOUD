import React from "react";
import logo from '../images/logo_v1.png'

export default function Footer(){
    return(
        <div>
            <footer className="footer-bs">
                <div className="row">
                    <div className="col-md-5 footer-brand animated fadeInLeft">
                        <img src={logo} alt=""/>
                        {/*<h2><div  style={{'position':'relative','top':'-25px','height':'50px'}}*/}
                        {/*>*/}
                        {/*    /!*#969a9d*!/*/}
                        {/*    <span style={{'padding':"0",'position':'relative','top':'20px','fontSize':'58px'}} className="fa fa-cloud"> </span>*/}
                        {/*    <br/>*/}
                        {/*    <span style={{'position':'relative','top':'-20px','fontSize':'42px','color':'#2c343b'}}*/}
                        {/*          className='fa fa-graduation-cap'> </span>*/}
                        {/*</div></h2>*/}
                        <p>Where students can create an account according to his/her university and major and can find all courses;
                            documents or videos; show or download them and make a blog for students to more interaction.
                            It will include an admin panel to manage all website operations and include a notifications system. </p>
                        <p>© 2021 Student Cloud, All rights reserved</p>
                        <p><u>designed by <b>Abdul Rahman :)</b></u></p>
                    </div>
                    <div className="col-md-4 footer-nav animated fadeInUp">
                        <h2 className='text-center' style={{'color':'#fff'}} >Menu —</h2>
                        <div className="col-md-4" style={{'display':'inline-block'}}>
                            <ul className="pages" >
                                <li><a href="#">Travel</a></li>
                                <li><a href="#">Nature</a></li>
                                <li><a href="#">Explores</a></li>
                                <li><a href="#">Science</a></li>
                                <li><a href="#">Advice</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3" style={{'display':'inline-block'}}>
                            <ul className="list">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contacts</a></li>
                                <li><a href="#">Terms & Condition</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-2 footer-social animated fadeInDown" >
                        <h3 >Follow Us</h3>
                        <ul>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">RSS</a></li>
                        </ul>
                    </div>
                    {/*  <div className="col-md-3 footer-ns animated fadeInRight">*/}
                    {/*      <h4>Newsletter</h4>*/}
                    {/*      <p>A rover wearing a fuzzy suit doesn’t alarm the real penguins</p>*/}
                    {/*      <p>*/}
                    {/*          <div className="input-group">*/}
                    {/*              <input type="text" className="form-control" placeholder="Search for..."/>*/}
                    {/*              <span className="input-group-btn">*/}
                    {/*  <button className="btn btn-default" type="button"><span*/}
                    {/*      className="glyphicon glyphicon-envelope"></span></button>*/}
                    {/*</span>*/}
                    {/*          </div>*/}
                    {/*          <!-- /input-group -->*/}
                    {/*      </p>*/}
                    {/*  </div>*/}
                </div>
            </footer>
            {/*<section style={{"text-align:center; margin:10px auto;"}}><p>Designed by <a href="http://princesargbah.me">Prince*/}
            {/*    J. Sargbah</a></p></section>*/}

        </div>
    )
}
