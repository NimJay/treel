import clone from 'clone';
import { ajax } from 'jquery';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { School } from '../../model/School.js';
import { log } from '../../util/Global.js';
import SchoolSelector from './SchoolSelector.jsx';


/**
 * <ClasseCreationSection>
 */
class ClasseCreationSectionNoRouter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createNewSchool: false,
            school: null,
            courseCode: "",
            courseName: "",
            term: "",
            currentAjax: null, // Current request to create-class.
            errorMessage: ""
        };
    }

    // State setters.
    setSchool(school) {this.setState({ school });}
    createNewSchool() {
        this.setState({
            createNewSchool: true,
            school: new School({ name: "", country: "" })
        });
    }
    setCourseCode(e) {this.setState({ courseCode: e.target.value })}
    setCourseName(e) {this.setState({ courseName: e.target.value })}
    setTerm(e) {this.setState({ term: e.target.value })}

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.
        let { currentAjax, courseCode, courseName, term, school } = this.state;
        if (currentAjax) return false;
        currentAjax = ajax({
            type: 'POST',
            url: '/api/classe/create-classe',
            contentType: 'application/json',
            data: JSON.stringify({ courseCode, courseName, term, school }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, classe, school } = data,
            errorMessage = "",
            currentAjax = null;
        if (error && error.code == 4) errorMessage = "Invalid input.";
        else if (error || !classe) errorMessage = "Something went wrong.";
        else this.props.history.push('/class/' + classe._id);
        this.setState({ currentAjax });
    }
    onAjaxError(error) {
        log(error);
        this.setState({
            currentAjax: null,
            errorMessage: "Sorry, something went wrong." });
    }

    render() {
        let { createNewSchool, school, courseCode, courseName, term,
            errorMessage } = this.state;

        return (
            <main className="block row classecreationsection">
                <h1>Create a Class</h1>
                <p className="errormessage">{errorMessage}</p>
                {createNewSchool ? null :
                    <SchoolSelector school={school}
                        createNewSchool={this.createNewSchool.bind(this)}
                        onSelect={this.setSchool.bind(this)} />}
                {school ?
                    <form onSubmit={this.onSubmit.bind(this)}>
                        {createNewSchool ?
                            <SchoolCreator school={school}
                                onChange={this.setSchool.bind(this)} /> : null}
                        <input type="text" value={courseCode}
                            onChange={this.setCourseCode.bind(this)}
                            placeholder="Course Code" /><br/>
                        <input type="text" value={courseName}
                            onChange={this.setCourseName.bind(this)}
                            placeholder="Course Name" /><br/>
                        <input type="text" value={term}
                            onChange={this.setTerm.bind(this)}
                            placeholder="Term" />
                        <div className="buttons-right">
                            <button type="submit">
                                Create
                            </button>
                        </div>
                    </form> : null}
            </main>
        );
    }
}
const ClasseCreationSection = withRouter(ClasseCreationSectionNoRouter);

const SchoolCreator = ({ onChange, school }) => {
    let onChangeName = (e) => {
        let name = e.target.value,
            s = clone(school);
        s.name = name;
        onChange(s);
    };
    let onChangeCountry = (e) => {
        let country = e.target.value,
            s = clone(school);
        s.country = country;
        onChange(s);
    };
    return (
        <div>
            <input type="text" value={school.name} onChange={onChangeName}
                placeholder="School Name" autoFocus={true} /><br/>
            <input type="text" value={school.country} onChange={onChangeCountry}
                placeholder="School Country" />
        </div>
    );
};


export default ClasseCreationSection;
