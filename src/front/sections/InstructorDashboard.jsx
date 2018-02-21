import { ajax } from 'jquery';
import React from 'react';
import { Link } from 'react-router-dom';
import { log } from '../util/Global.js';
import { Classe } from '../model/Classe.js';
import { School } from '../model/School.js';


class InstructorDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            currentAjax: null,
            showInActive: false
        };
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
            currentAjax: this.getDashboard(),
            error: false
        });
    }

    getDashboard() {
        return ajax({
            'type': 'POST',
            'url': '/api/classe/get-dashboard',
            'dataType': 'json',
            'success': this.onAjaxSuccess.bind(this),
            'error': this.onAjaxError.bind(this)
        });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, classes, schools } = data,
            currentAjax = null;
        error = !!error || !classes || !schools;
        if (classes) classes = classes.map(c => new Classe(c));
        if (schools) schools = schools.map(s => new School(s));
        this.setState({ error, classes, schools, currentAjax });
    }
    onAjaxError(error) {
        log(error);
        this.setState({
            currentAjax: null,
            error: true
        });
    }

    showInActive() {this.setState({ showInActive: true });}

    render () {
        let { isMounted, currentAjax, error, classes, schools,
            showInActive } = this.state;

        if (!isMounted) return null;
        if (currentAjax) return <LoadingSection />;

        let activeDivs = classes.filter(c => c.isActive).map(c =>
            <ClasseDiv classe={c} key={c._id}
                school={schools.filter(s => s._id == c.school).push(null)[0]} />
        );

        let inactiveDivs = classes.filter(c => !c.isActive).map(c =>
            <ClasseDiv classe={c} key={c._id}
                school={schools.filter(s => s._id == c.school).push(null)[0]} />
        );

        return (
            <main className="instructordashboard block row">
                <div className="buttons-right">
                    <Link to="/class/new" className="button">New Class</Link>
                </div>
                <div>{activeDivs}</div>
                {inactiveDivs.length > 0 && !showInActive &&
                    <button className="button-mini"
                        onClick={this.showInActive.bind(this)}>
                        Show Inactive Classes</button>}
                {showInActive && <h2>Inactive Classes</h2>}
                {showInActive && inactiveDivs}
                {error && <p>Sorry, something went wrong.</p>}
            </main>
        );
    }
}

const ClasseDiv = ({ classe, school }) => (
    <Link className="classe" to={"class/" + classe._id}>
        <div>{classe.courseCode}</div>
        <div>{classe.courseName}</div>
        <div>{classe.term}</div>
    </Link>
);

const LoadingSection = () => (<div><p>Loading...</p></div>);

export default InstructorDashboard;
