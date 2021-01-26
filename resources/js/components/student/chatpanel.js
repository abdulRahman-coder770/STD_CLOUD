import React, {useEffect, useState} from 'react';
import './styles.css';
import {Navbar} from "./Navbar";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import moment, {now} from "moment";
import LoadingBar from "react-top-loading-bar";

export default function chat() {
    const [message, setMessage] = useState('')
    const [rec_id, setRec_id] = useState(0)
    const [recName, setRecName] = useState('')
    const [recPhoto, setRecPhoto] = useState('')
    const user_id = localStorage.getItem('userId')
    const major_id = localStorage.getItem('major_id')
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [progress, setProgress] = useState(0)
    const [here, setHere] = useState(0)
    let rev;

    async function getUsers() {
        setProgress(50)
        await axios.post('http://localhost:8000/api/auth/students/chat/getUsers'
            ,
            {
                'major_id': major_id,
                'user_id': localStorage.getItem('userId')
            }
        ).then((res) => {
            setUsers(res.data.users);
            setProgress(100)

        })
    }

    function setAsRead(sender_id) {
        axios.patch('http://localhost:8000/api/auth/students/chat/setAsRead'
            ,
            {
                'sender_id': sender_id,
                'rec_id': localStorage.getItem('userId')
            }
        ).then((res) => {
            if (res.data.status == 1) {
                getUsers()
            }
        })
    }

    async function send(event) {
        event.preventDefault()
        let d=new Date()
        d.setHours(d.getHours() - 2);
        console.log(d)
        setMessages(prevState => [
            ...prevState, {
                ...{
                    'id': now(),
                    // 'sender':sender.name,
                    'message': message,
                    // 'rec':rec.name,
                    'created_at': d,
                    'rec_id': rec_id,
                    'sender_id': user_id
                }
            }])
        let m = message

        setMessage('')
        scroll()
        await axios.post('http://localhost:8000/api/auth/students/chat/sendMessage'
            ,
            {
                'sender_id': user_id,
                'message': m,
                'rec_id': rec_id
            }
        ).then((res) => {

            // console.log(res.data)
        })
    }

    // localStorage.setItem('chat_rec_id','0')

    async function selectUser(e) {
        setRec_id(e.target.value)
        localStorage.setItem('chat_rec_id', e.target.value)
        // alert(rev)
        getMessagesUser(e.target.value)
        setAsRead(e.target.value)

    }

    function scroll() {
        let log = $('#chat_box');
        log.animate({scrollTop: log.prop('scrollHeight')}, 100);
    }

    async function getMessagesUser(id) {

        // alert(rec_id)
        await axios.post('http://localhost:8000/api/auth/students/chat/getMessagesUser'
            ,
            {
                'sender_id': user_id,
                'rec_id': id
            }
        ).then((res) => {
            setMessages(res.data.messages)
            setRecName(res.data.rec.name)
            setRec_id(res.data.rec.id)
            setRecPhoto(res.data.rec.photo_path)
            scroll()
            console.log(res.data)
        })
    }

    var pusher = new Pusher('145fd4707199ab20c070', {
        cluster: 'ap2',
        forceTLS: true,
        encrypted: true
    });
    useEffect(() => {
            let channel = pusher.subscribe('student-cloud');
            channel.bind('chat-message', function (data) {
                let mes = data['message'];
                let sender = data['sender'];
                let rec = data['rec'];

                if (
                    mes.rec_id == localStorage.getItem('userId') && sender.id != localStorage.getItem('chat_rec_id')
                ) {

                    getUsers();
                    (new Audio('http://localhost:8000/sounds/notify.mp3')).play();
                }
                if (
                    mes.rec_id == localStorage.getItem('userId') && sender.id == localStorage.getItem('chat_rec_id')
                ) {
                    console.log(mes)
                    console.log(sender)
                    console.log(rec)
                    setAsRead(localStorage.getItem('chat_rec_id'))
                    setMessages(prevState => [
                        ...prevState, {
                            ...{
                                'id': mes.id,
                                'sender': sender.name,
                                'message': mes.message,
                                'rec': rec.name,
                                'created_at': mes.created_at,
                                'rec_id': mes.rec_id,
                                'sender_id': mes.sender_id
                            }
                        }]
                    )
                    scroll()
                }

            })
        }
        , []);
    useEffect(() => {
            getUsers()
        }
        , []);

    return (
        <div className='container-fluid'>
            <LoadingBar
                color='#008DD5'
                height='5px'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Navbar/>
            <br/><br/><br/><br/><br/>
            <div className="row">
                <div className="col-sm-1"></div>
                <div className="col-sm-3">
                    <ul className="users">
                        {
                            users.map((u, i) =>
                                u.id == localStorage.getItem('userId') ?
                                    <></> :
                                    <li key={u.id.toString()} className="person"
                                        onClick={selectUser}
                                        value={u.id}
                                        data-chat="person1">
                                        <div className="user">
                                           <span>{
                                               u.photo_path == null ?
                                                   <div style={{
                                                       'padding': '2px',
                                                       'border': '0.5px solid white',
                                                       'backgroundColor': 'black',
                                                       'width': '40px',
                                                       'height': '40px',
                                                       'display': 'inline-block',
                                                       'marginRight': '5px'
                                                   }} className='rounded-circle'>

                                                       <h3 className='text-light text-center'>{u.name.charAt(0).toUpperCase()}</h3>


                                                   </div>
                                                   : <img
                                                       style={{
                                                           'padding': '2px',
                                                           'width': '45px',
                                                           'height': '45px'
                                                       }} className='rounded-circle'

                                                       src={'http://localhost:8000/photos/' + u.photo_path} alt=""/>
                                           }

                                           </span>

                                            {/*<span className="status busy"></span>*/}
                                        </div>
                                        <span className="name-time text-light">
                                            {u.name}
                                            {/*<span className="time">15/02/2019</span>*/}
                                            <span

                                                className='badge badge-danger float-right'>{
                                                u.count_unread_messages === 0 ?
                                                    '' :
                                                    u.count_unread_messages
                                            }</span>
                                        </span>

                                    </li>
                            )
                        }

                    </ul>
                </div>
                <div className="col-sm-7">
                    <div className="chat card">
                        <div className='card-header' style={{'height':'75px'}}>
                            <div className="user">
                                {
                                    rec_id === 0 ? <></> :
                                        <>
                                           <span>
                                               {
                                                   recPhoto == null ?
                                                       <div style={{
                                                           'padding': '2px',
                                                           'border': '0.5px solid white',
                                                           'backgroundColor': 'black',
                                                           'width': '45px',
                                                           'height': '45px',
                                                           'display': 'inline-block',
                                                           'marginRight': '5px'
                                                       }} className='rounded-circle'>

                                                           <h2 className='text-light text-center'>
                                                               {recName.charAt(0).toUpperCase()}</h2>


                                                       </div> :

                                                       <img className='rounded-circle'
                                                            width={50} height={50}
                                                            src={'http://localhost:8000/photos/' + recPhoto}
                                                            alt="Retail Admin"/>
                                               }
                                           </span>
                                            <span style={{'marginLeft': '10px'}}
                                                  className="name text-light">{recName}</span>
                                            <span className="status online"> </span>
                                        </>
                                }

                            </div>
                            <p className="name-time">

                            </p>
                        </div>
                        <div
                            style={{
                                'border': 'none',
                                'borderBottom': 'none',
                            }}
                            id={'chat_box'}
                            className="chat-container card-body">
                            <ul className="chat-list">
                                {messages.map((m, i) =>
                                    m.sender_id == localStorage.getItem('userId') ?
                                        <li className="out">
                                            {/*<div className="chat-img">*/}
                                            {/*    <img alt="Avtar"*/}
                                            {/*         src="https://bootdey.com/img/Content/avatar/avatar6.png"/>*/}
                                            {/*</div>*/}
                                            <div className="chat-body">
                                                <div className="chat-message">

                                                    <p className='text-light text-md-left'>{m.message}</p>
                                                    {/*<br/>*/}
                                                    <span style={{'fontSize': '10px','color':'rgba(255,255,255,.7)'}}
                                                          className='float-left text-sm-left'>{moment(m.created_at).add(2, 'hours').fromNow()}</span>

                                                </div>
                                            </div>
                                        </li>
                                        :

                                        <li
                                            // onClick={selectUser}
                                            // value={m.id}
                                            key={m.id.toString()} className="in">
                                            {/*<div className="chat-img">*/}
                                            {/*    <img alt="Avtar"*/}
                                            {/*         src="https://bootdey.com/img/Content/avatar/avatar1.png"/>*/}
                                            {/*</div>*/}
                                            <div className="chat-body">
                                                <div className="chat-message">

                                                    <p className='text-light text-md-left'>{m.message}</p>
                                                    {/*<br/>*/}
                                                    <span style={{'fontSize': '10px','color':'rgba(255,255,255,.7)'}}
                                                          className='float-right text-sm-right '>{moment(m.created_at).add(2, 'hours').fromNow()}</span>

                                                </div>
                                            </div>
                                        </li>
                                )}
                            </ul>

                        </div>
                        <form onSubmit={send} className="">
                            <div style={{'position': 'relative', 'top': '19px',}} className='form-group'>
                                <input
                                    disabled={rec_id === 0}
                                    onChange={event => setMessage(event.target.value)}
                                    value={message}
                                    style={{
                                        'width': '91.5%',
                                        'display': 'inline-block',
                                        'borderLeft': 'none',
                                        'borderBottom': 'none',

                                    }}
                                    className='form-control' type="text" placeholder="type a message"/>
                                <button
                                    disabled={rec_id === 0}
                                    style={{'position': 'relative', 'top': '-2px','backgroundColor':'rgba(142, 85, 142,1)'}}
                                    className='btn btn-secondary' type="submit">Send
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
