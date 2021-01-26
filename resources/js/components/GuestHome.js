import React from 'react';
import ReactDOM from 'react-dom';

export default function GuestHome() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header"><h1>hello guest</h1></div>

                        <div className="card-body">I'm an guest component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
