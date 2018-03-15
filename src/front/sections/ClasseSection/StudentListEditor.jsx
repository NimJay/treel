import isemail from 'isemail';
import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../util/Global.js';


// Return the number of emails detected in given a StudentList string.
function getNumberOfEmails(sl) {
    return sl.split(/[\s,]/).filter(isemail.validate).length;
}

class StudentListEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAjaxGet: this.getStudentList(),
            errorGet: false,
            studentList: "",
            currentAjaxSave: null,
            errorMessage: ""
        };
    }

    getStudentList() {
        return ajax({
            type: 'POST',
            url: '/api/classe/get-studentlist',
            contentType: 'application/json',
            data: JSON.stringify({ classeId: this.props.classe._id }),
            dataType: 'json',
            success: this.onAjaxSuccessGet.bind(this),
            error: this.onAjaxErrorGet.bind(this)
        });
    }
    onAjaxSuccessGet(data) {
        log(data);
        let { error, studentList } = data,
            currentAjaxGet = null,
            errorGet = !!error;
        if (studentList && studentList.studentList)
            studentList = studentList.studentList;
        else
            studentList = "amy@example.com\nbob@example.com\ncao@example.com";
        this.setState({ currentAjaxGet, errorGet, studentList });
    }
    onAjaxErrorGet(error) {
        log(error);
        this.setState({ currentAjaxGet: null });
    }

    setStudentList(e) {this.setState({ studentList: e.target.value });}


    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.
        let { currentAjaxSave } = this.state,
            errorMessage = '';
        if (currentAjaxSave) return false;
        currentAjaxSave = ajax({
            type: 'POST',
            url: '/api/classe/update-studentlist',
            contentType: 'application/json',
            data: JSON.stringify({
                classeId: this.props.classe._id,
                studentList: this.state.studentList
            }),
            dataType: 'json',
            success: this.onAjaxSuccessSave.bind(this),
            error: this.onAjaxErrorSave.bind(this)
        });
        this.setState({ currentAjaxSave, errorMessage });
    }
    onAjaxSuccessSave(data) {
        log(data);
        let { error } = data,
            currentAjaxSave = null,
            errorMessage = "",
            cb = null;
        if (error) errorMessage = "Sorry, something went wrong";
        else cb = this.props.onClose;
        this.setState({ errorMessage, currentAjaxSave }, cb);
    }
    onAjaxErrorSave(error) {
        log(error);
        this.setState({ currentAjaxSave: null,
            errorMessage: "Something went wrong." });
    }


    render() {
        let { } = this.props,
            { currentAjaxGet, errorGet, studentList,
                errorMessage } = this.state;

        if (currentAjaxGet) return null;

        if (errorGet)
            return (<section><p>Sorry, something went wrong.</p></section>);

        return (
            <section className="block row">
                <h2>Student List</h2>
                <p>Note: Access will only be limited to the provided emails if the class is private.</p>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <textarea value={studentList}
                        placeholder="List emails here..."
                        onChange={this.setStudentList.bind(this)}></textarea>
                    <EmailCounter studentList={studentList} />
                    <p className="errormessage">{errorMessage}</p>
                    <div className="buttons-right">
                        <button type="submit">Save</button>
                    </div>
                </form>
            </section>
        );
    }
}

const EmailCounter = ({ studentList }) => (
    <p>{getNumberOfEmails(studentList)} emails detected.</p>
);

export default StudentListEditor;
