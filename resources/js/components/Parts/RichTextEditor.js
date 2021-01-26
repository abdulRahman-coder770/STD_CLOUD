import React, { Component } from 'react';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale


class RichTextEditor extends Component {


    onImageUpload(images, insertImage) {

        console.log('onImageUpload', images);
        /* FileList does not support ordinary array methods */
        for (let i = 0; i < images.length; i++) {
            /* Stores as bas64enc string in the text.
             * Should potentially be stored separately and include just the url
             */
            const reader = new FileReader();

            reader.onloadend = () => {
                insertImage(reader.result);
            };

            reader.readAsDataURL(images[i]);
        }
    };

    render() {
        return (
            <ReactSummernote
                value={this.props.value}
                options={{
                    lang: 'en-EN',
                    height: 200,
                    dialogsInBody: true,
                    toolbar: [
                        // ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']],
                        ['view', ['fullscreen', 'codeview']]
                    ]
                }}
                onChange={this.props.onChange}
                onImageUpload={this.onImageUpload}
            />
        );
    }
}

export default RichTextEditor;
