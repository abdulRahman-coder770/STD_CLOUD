import moment from "moment";
import React from "react";


export default function Reply(props){

    return(
        <li key={props.data.id.toString()}>
            <div className='card'>
                <div className='card-header'>
                       <span>{
                           props.data.photo_path == null ?
                               <div style={{
                                   'padding': '2px',
                                   'border': '0.5px solid white',
                                   'backgroundColor': 'black',
                                   'width': '25px',
                                   'height': '25px',
                                   'display': 'inline-block',
                                   'marginRight': '5px'
                               }} className='rounded-circle'>

                                   <h3 className='text-light text-center'>{props.data.user_name.charAt(0).toUpperCase()}</h3>


                               </div>
                               : <img
                                   style={{
                                       'padding': '2px',
                                       'width': '30px',
                                       'height': '30px'
                                   }} className='rounded-circle'

                                   src={'http://localhost:8000/photos/' + props.data.user.photo_path}
                                   alt=""/>
                       }
                       </span>
                    <span className='text-light'> {props.data.user.name}</span>
                    <span className='float-right text-success'>
                                                                            {moment(props.data.created_at).fromNow()}
                                                                         </span>
                </div>
                <div className='card-body'>
                    <p>{props.data.body}</p>
                </div>
            </div>
        </li>
    )
}
