import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Message extends Component {
    constructor() {
        super();
        this.state = {
            message:[]
        };
    }
    componentDidMount()
    {
        console.log("Mounted component message");
        // Enable pusher logging - don't include this in production
        this.Pusher.logToConsole = true;

        var pusher = new Pusher('145fd4707199ab20c070', {
            cluster: 'ap2',
            forceTLS: true
        });
        const this2 = this
        var channel = pusher.subscribe('channel1');
        channel.bind('event1', function(data) {
            const message = this2.state.message
            message.push(data.data)
            this2.setState({message:message})
        });
    }
    render() {
        return (
            <div className="container">
                <p>I'm an component message 2!</p>
                {
                    this.state.message.map((msg)=>{
                        return(
                            <p> <b>{msg.user} </b> = {msg.message}</p>
                        )
                    })
                }
            </div>
        );
    }
}
