import React from 'react';
import { ajax } from 'jquery';
import { log } from '../../../../util/Global.js';
import FileUploaderSection from '../../../FileUploaderSection.jsx';


/**
 * <FileSelector>
 * Props: classe, onSelect(file)
 */
class FileSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            currentAjax: null,
            error: false,
            files: null,
            showUploader: false
        };
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
            currentAjax: this.getFiles()
        });
    }

    getFiles() {
        return ajax({
            type: 'POST',
            url: '/api/content/get-files',
            contentType: 'application/json',
            data: JSON.stringify({ classeId: this.props.classe._id }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, files } = data,
            showUploader = files && files.length == 0,
            currentAjax = null;
        error = error || !files;
        this.setState({ files, showUploader, error, currentAjax });
    }
    onAjaxError(error) {
        log(error);
        this.setState({ error: true, currentAjax: null });
    }

    showUploader() {this.setState({ showUploader: true });}

    render() {
        let { classe, onSelect } = this.props,
            { isMounted, currentAjax, error, files, showUploader } = this.state;

        if (!isMounted) return null;
        if (currentAjax) return <LoadingSection />;
        if (error) return <ErrorSection />;

        if (showUploader)
            return <FileUploaderSection classe={classe} onUpload={onSelect} />;

        let fileDivs = files.map(f =>
            <FileDiv file={f} onSelect={onSelect.bind(null, f)} key={f._id} />);


        return (
            <div className="block row fileselector">
                <button type="button" onClick={this.showUploader.bind(this)}>
                    Upload File
                </button>
                {fileDivs.length > 0 && <h3>Or select an existing file:</h3>}
                {fileDivs}
            </div>
        );
    }
}

const ErrorSection = () => (<div className="block row"><p>Sorry, something went wrong.</p></div>);
const LoadingSection = () => (<div className="block row"><p>Loading...</p></div>);
const FileDiv = ({ file, onSelect }) => (
    <div className="fileselector-file">
        <div className="col-1-2">
            <button className="button-mini" type="button"
                onClick={onSelect}>{file.name}</button>
        </div>
        <div className="col-1-2 align-right">
            <a target="_blank" href={"/file/" + file._id}>Download</a>
        </div>
    </div>
);

export default FileSelector;
