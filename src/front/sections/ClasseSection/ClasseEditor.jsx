import clone from 'clone';
import { ajax } from 'jquery';
import React from 'react';
import { Classe } from '../../model/Classe.js';
import { log } from '../../util/Global.js';
import Checkbox from '../../components/Checkbox.jsx';


/**
 * <ClasseEditor>
 * Props: classe, onUpdate(classe)
 */
class ClasseEditor extends React.Component {

    constructor(props) {
        super(props);
        let c = props.classe;
        this.state = {
            courseCode: c.courseCode,
            courseName: c.courseName,
            term: c.term,
            isActive: c.isActive,
            isPrivate: c.isPrivate,
            currentAjax: null,
            errorMessage: ''
        };
    }

    setCourseCode(e) {this.setState({ courseCode: e.target.value })}
    setCourseName(e) {this.setState({ courseName: e.target.value })}
    setTerm(e) {this.setState({ term: e.target.value })}
    setIsActive(isActive) {this.setState({ isActive })}
    setIsPrivate(isPrivate) {this.setState({ isPrivate })}

    onSubmit(e) {
        e.preventDefault(); // Prevent page refresh.
        let { currentAjax, courseCode, courseName, term, isActive,
            isPrivate } = this.state,
            classeId = this.props.classe._id;
        if (currentAjax) return false;
        currentAjax = ajax({
            type: 'POST',
            url: '/api/classe/update-classe',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, courseCode, courseName, term,
                isActive, isPrivate }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, classe } = data,
            errorMessage = "",
            callback = null,
            currentAjax = null;
        if (error && error.code == 4) errorMessage = "Invalid input.";
        else if (error || !classe) errorMessage = "Something went wrong.";
        else {
            let newClasse = clone(this.props.classe);
            newClasse.courseCode = classe.courseCode;
            newClasse.courseName = classe.courseName;
            newClasse.term = classe.term;
            newClasse.isActive = classe.isActive;
            newClasse.isPrivate = classe.isPrivate;
            callback = this.props.onUpdate.bind(null, newClasse);
        }
        this.setState({ currentAjax, errorMessage }, callback);
    }
    onAjaxError(error) {
        log(error);
        this.setState({
            currentAjax: null,
            errorMessage: "Sorry, something went wrong." });
    }

    render() {

        let { currentAjax, errorMessage, courseCode, courseName, term, isActive,
            isPrivate } = this.state;

        return (
            <form className="block row" onSubmit={this.onSubmit.bind(this)}>
                <p className="errormessage">{errorMessage}</p>
                <input type="text" value={courseCode}
                    onChange={this.setCourseCode.bind(this)}
                    placeholder="Course Code" /><br/>
                <input type="text" value={courseName}
                    onChange={this.setCourseName.bind(this)}
                    placeholder="Course Name" /><br/>
                <input type="text" value={term}
                    onChange={this.setTerm.bind(this)}
                    placeholder="Term" /><br/>
                <Checkbox label="Active" value={isActive}
                    onChange={this.setIsActive.bind(this)} /><br/>
                <Checkbox label="Private" value={isPrivate}
                    onChange={this.setIsPrivate.bind(this)} />
                <div className="buttons-right">
                    <button type="submit">Save</button>
                </div>
                <button type="button"
                    className="button-mini">Edit Student Emails</button><br/>
                <button type="button" disabled
                    className="button-mini">Edit Instructor Emails</button>
            </form>
        );
    }
}


export default ClasseEditor;
