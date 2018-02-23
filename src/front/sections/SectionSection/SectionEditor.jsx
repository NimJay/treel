import clone from 'clone';
import { ajax } from 'jquery';
import React from 'react';
import { Classe } from '../../model/Classe.js';
import { log } from '../../util/Global.js';
import Checkbox from '../../components/Checkbox.jsx';


/**
 * <SectionEditor>
 * Props: section, onUpdate(section)
 */
class SectionEditor extends React.Component {

    constructor(props) {
        super(props);
        let s = props.section;
        this.state = {
            name: s.name,
            isDeleted: s.isDeleted,
            currentAjax: null,
            errorMessage: ''
        };
    }

    setName(e) {this.setState({ name: e.target.value })}
    setIsDeleted(isDeleted) {this.setState({ isDeleted })}

    onSubmit(e) {
        e.preventDefault(); // Prevent page refresh.
        let { currentAjax, name, isDeleted } = this.state,
            classeId = this.props.classeId,
            sectionId = this.props.section._id;
        if (currentAjax) return false;
        currentAjax = ajax({
            type: 'POST',
            url: '/api/section/update-section',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, name, isDeleted }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, section } = data,
            errorMessage = "",
            cb = null,
            currentAjax = null;
        if (error && error.code == 4) errorMessage = "Invalid input.";
        else if (error || !section) errorMessage = "Something went wrong.";
        else cb = this.props.onUpdate.bind(null, section);
        this.setState({ currentAjax, errorMessage }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null,
            errorMessage: "Sorry, something went wrong." });
    }

    render() {

        let { currentAjax, errorMessage, name, isDeleted } = this.state;

        return (
            <form className="block row" onSubmit={this.onSubmit.bind(this)}>
                <p className="errormessage">{errorMessage}</p>
                <input type="text" value={name} placeholder="Name"
                    onChange={this.setName.bind(this)} /><br/>
                <Checkbox label="Delete" value={isDeleted}
                    onChange={this.setIsDeleted.bind(this)} /><br/>
                <div className="buttons-right">
                    <button type="submit">Save</button>
                </div>
            </form>
        );
    }
}


export default SectionEditor;
