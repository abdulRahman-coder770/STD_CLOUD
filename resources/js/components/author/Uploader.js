import React, {Component, Fragment, useState} from 'react';
import Dropzone from 'react-dropzone';
import toastr from 'toastr';
// import {post} from 'axios';

export default function Uploader () {
    const [images,setImages]=useState([])
    const [progress,setProgress]=useState(0)
    const [uploading,setUploading]=useState(true)
    const [supported_mime]=useState([  'image/jpeg',
                                                'image/png',
                                                'image/gif',])


    function onDrop(images){
        setImages(images)

    }

    function onDropRejected(images){
        if(images.length){
            toastr.error('Please upload valid image files. Supported extension JPEG and PNG', 'Invalid MIME type')
        }
    }

    function removeDroppedFile(preview, e = null){
        setImages(images.filter((image) => {
            return image.preview !== preview
        }))
    }

    function uploadFiles(){
        let images = images,
            config = { headers: { 'Content-Type': 'multipart/form-data' } },
            total_files = images.length,
            uploaded = 0;
        setUploading(true)


        images.map((image) => {
            let formData = new FormData();
            formData.append("file", image);

            axios.post("/photos", formData, config).then(response => {
                const done = response.data;
                if(done){
                    removeDroppedFile(image.preview);
                    calculateProgress(total_files, ++uploaded);
                }
            });
        });
    }

    function calculateProgress(total, uploaded){
        let percentage = (uploaded / total) * 100;
        setProgress(percentage)
        setUploading(true)

        if(percentage === 100){
            toastr.success('Images uploaded to gallery');
            setUploading(false)
        }
    }


        return (
            <div className="uploader">
                <div className="text-center">
                    <Dropzone
                        onDropAccepted={onDrop}
                        onDropRejected={onDropRejected}
                        // className="btn btn-dark"
                        accept={supported_mime}
                    />
                    {/*    {'select files'}*/}

                    {/*</Dropzone>*/}

                    {images.length > 0 &&
                    <button
                        className="btn btn-dark uploadBtn"
                        onClick={uploadFiles}
                    >
                        Upload
                    </button>
                    }

                </div>

                {images.length ?
                    <Fragment>
                        {uploading &&
                        <div className="progress">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{width : progress}}
                                aria-valuenow={progress}
                                aria-valuemin="0"
                                aria-valuemax="100"/>
                        </div>
                        }

                        <div className="images">
                            {
                                images.map((file) =>
                                    <div key={file.preview} className="image">
                                        <span
                                            className="close"
                                            onClick={removeDroppedFile(this,file.preview)}
                                        >X</span>
                                        <img src={file.preview} alt=""/>
                                    </div>
                                )
                            }
                        </div>
                    </Fragment>
                    :
                    <div className="no-images">
                        <h5 className="text-center">
                            Selected images will appear here
                        </h5>
                    </div>
                }
            </div>

        );
    }

