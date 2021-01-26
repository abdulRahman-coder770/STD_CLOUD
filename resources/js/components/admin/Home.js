import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from "react-router-dom";
import DropZone from "../Parts/dropzone/DropZone";
import $ from 'jquery';
import UniManager from "./UniManager";
import MajorManager from "./MajorManager";
import CourseManager from "./CourseManager";
import UserManager from "./UserManger";
import {Chart} from "react-google-charts";


export default function AdminHome() {
    const [unis,setUnis]=useState([])
    const [data, setData] = useState({})


        async function getChartData() {
            await axios.get("http://127.0.0.1:8000/api/auth/admin/getDataChart")
                .then((res) => {
                    console.log(res.data.data)
                    setData(res.data.data)
                })
        }





        useEffect(() => {
                getChartData();
                async function getUnis() {
                    await axios.get("http://127.0.0.1:8000/api/auth/admin/getAllUnis")
                        .then((res) => {
                            console.log(res.data.unis)
                            setUnis(res.data.unis)
                        })
                }
                getUnis()
            }
            , []);

    // $('.node0').click(function (){
    //     console.log('hello')
    // })

    var toggler = document.getElementsByClassName("node");
    var i;


    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("fa fa-caret-down");
        });
    }
    return(
        <div className='row'>
            <div className="col-sm-5">
                <ul id="MyUl" style={{'color':'rgb(142, 85, 142)'}}>
                {
                    unis.map((uni,i)=>

                        <li className='node' style={{'fontSize':'20px','fontWeight':'4px','cursor':'pointer'}} key={uni.id.toString()}>
                            <span className='node' data-toggle="collapse" data-target={"#collapseExampleUni"+uni.id} aria-expanded="false"
                                  aria-controls={"collapseExampleUni"+uni.id} style={{'color':'rgb(142, 85, 142)'}}>
                            <i className="fa fa-caret-right text-danger"
                                data-toggle="collapse" data-target={"#collapseExampleUni"+uni.id} aria-expanded="false"
                                aria-controls={"collapseExampleUni"+uni.id}
                                style={{'fontSize':'18px','fontWeight':'4px','cursor':'pointer','color':'rgb(142, 85, 142)'}}> </i>
                            {uni.uni_name}</span>
                        <ul className="collapse" id={"collapseExampleUni"+uni.id}>
                            {uni.majors.map((m, i) =>
                                <li key={m.id.toString()} className='nested_node' style={{'fontSize':'16px','fontWeight':'4px','cursor':'pointer'}}>
                                    <span className='nested_node' data-toggle="collapse" data-target={"#collapseExampleMajor"+m.id} aria-expanded="false"
                                          aria-controls={"collapseExampleMajor"+m.id}>

                                        <i className="fa fa-caret-right"
                                           data-toggle="collapse" data-target={"#collapseExampleMajor"+m.id} aria-expanded="false"
                                           aria-controls={"collapseExampleMajor"+m.id}
                                           style={{'fontSize':'22px','fontWeight':'4px','cursor':'pointer'}}> </i>

                                        {m.major_name}</span>

                                    <ul style={{'listStyleType':'upper-latin'}} className="collapse" id={"collapseExampleMajor"+m.id}>
                                        {m.courses.map((c, i) =>
                                            <li key={c.id.toString()}>{c.course_name}
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            )}
                        </ul>
                        </li>


                    )}
                </ul>
            </div>
            <div className="col-sm-7">

                <div className={"my-pretty-chart-container"}>
                    <h2 className='' style={{'color':'rgb(142, 85, 142)'}}>Universities & Users</h2>
                    <Chart
                        chartType="PieChart"
                        data={data}
                        width="100%"
                        fill-color='#2c343b'

                        height="600px"
                        legendToggle
                        allowHtml={true}
                    />
                </div>
            </div>

        </div>
    )
}
