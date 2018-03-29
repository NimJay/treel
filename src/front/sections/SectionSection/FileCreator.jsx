import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../util/Global.js';
import FileSelector from './FileSelector.jsx';


/**
 * <FileCreator>
 * Props: classe, section, onCreation(content)
 */
class FileCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            name: "",
            description: "",
            currentAjax: null, // The current AJAX request.
            errorMessage: ""
        };
    }

    setFile(file) {this.setState({ 'file': file, 'name': file.name });}
    setName(e) {this.setState({ name: e.target.value });}
    setDescription(e) {this.setState({ description: e.target.value });}

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.

        let { classe, section } = this.props,
            classeId = classe._id,
            sectionId = section._id,
            { currentAjax, file, name, description } = this.state,
            content = { name, description };
        content.file = file._id;
        content.type = 'file';

        if (currentAjax) return false;

        currentAjax = ajax({
            type: 'POST',
            url: '/api/content/create-content',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, content }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, content } = data,
            cb = null,
            errorMessage = "",
            currentAjax = null;
        if (error && error.code == 4) errorMessage = "Invalid input.";
        else if (error || !content) errorMessage = "Something went wrong.";
        else cb = this.props.onCreation.bind(null, content);
        this.setState({ currentAjax, errorMessage }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null,
            errorMessage: "Sorry, something went wrong." });
    }


    render() {
        let { classe } = this.props,
            { file, name, description, errorMessage, currentAjax } = this.state;

        if (!file) {
            return (
                <FileSelector classe={classe}
                    onSelect={this.setFile.bind(this)} />
            );
        }

        return (
            <section className="block row">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <p className="errormessage">{errorMessage}</p>
                    <p>File: <a target="_blank" href={"/file/" + file._id}>
                        {file.name}</a></p>
                    <input type="text" value={name} placeholder="Name"
                        onChange={this.setName.bind(this)} autoFocus={true} />
                    <textarea value={description}
                        placeholder="Description"
                        onChange={this.setDescription.bind(this)}></textarea>
                    <div className="buttons-right">
                        <button type="submit"
                            disabled={currentAjax}>Create</button>
                    </div>
                </form>
            </section>
        );
    }
}


export default FileCreator;
