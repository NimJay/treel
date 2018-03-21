import React from 'react';
import { ajax } from 'jquery';
import { log } from '../util/Global.js';

let lastId = 0; // Each <input type="file"> has an ID.

/**
 * <FileUploaderSection>
 * Props: classe, onUpload(file)
 */
class FileUploaderSection extends React.Component {

    constructor(props) {
        super(props);
        this.id = ++lastId;
        this.state = {
            name: "", // Name of file.
            currentAjax: null, // The current AJAX request.
            progress: 0, // File upload progress.
            errorMessage: ""
        };
    }

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.
        if (this.state.currentAjax) return false; // Currently loading.

        let m = '',
            formData = new FormData(),
            element = document
                .getElementById('fileuploadersection-file-' + this.id);
        console.log(element.files);
        if (element.files.length == 0) m = 'Please select a file.';
        if (m.length > 0) return this.setState({ errorMessage: m });
        formData.append('file', element.files[0]);
        formData.append('classeId', this.props.classe._id);
        let currentAjax = ajax({
            type: 'POST',
            url: '/api/content/upload-file',
            xhr: () => {
                let myXhr = new window.XMLHttpRequest();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress',
                        this.onProgress.bind(this), false);
                }
                return myXhr;
            },
            data: formData,
            processData: false,
            contentType: false,
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        log(data);
        let { file, error } = data,
            currentAjax = null,
            errorMessage = '',
            cb = null;
        if (error || !file) errorMessage = 'Sorry, something went wrong.';
        else cb = this.props.onUpload.bind(null, file)
        this.setState({ currentAjax, errorMessage }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ errorMessage: 'Sorry, something went wrong.',
            currentAjax: null });
    }

    onProgress(e) {
        console.log("onProgress");
        let progress = 0,
            position = event.loaded || event.position,
            total = event.total;
        if (event.lengthComputable)
            progress = Math.ceil(position / total * 100);
        this.setState({ progress });
    }

    onCancel() {
        if (!this.state.currentAjax) return false;
        this.state.currentAjax.abort();
        this.setState(
            { currentAjax: null, progress: 0, errorMessage: "Cancelled." });
    }

    render() {
        let { errorMessage, currentAjax, progress } = this.state;
        return (
            <form className="fileuploadersection block row"
                onSubmit={this.onSubmit.bind(this)}>
                <p className="errormessage">{errorMessage}</p>
                <input id={"fileuploadersection-file-" + this.id} type="file" />
                <div className="fileuploadersection-progress">
                    <div style={{'width': progress + '%'}}></div>
                </div>
                <div className="buttons-right">
                    {currentAjax &&
                        <button type="button" onClick={this.onCancel.bind(this)}
                            className="color-red button-mini">Cancel</button>}
                    <button type="submit">Upload</button>
                </div>
            </form>
        );
    }
}


export default FileUploaderSection;
