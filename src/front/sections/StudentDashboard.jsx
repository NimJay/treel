import { ajax } from 'jquery';
import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import { Classe } from '../model/Classe.js';
import { School } from '../model/School.js';
import { log } from '../util/Global.js';
import LogoutButton from '../components/LogoutButton.jsx';


class StudentDashboard extends React.Component {

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
        let { app, setApp } = this.props,
            { isMounted, currentAjax, error, classes, schools,
            showInActive, } = this.state;

        if (!isMounted) return null;
        if (currentAjax) return <LoadingSection />;

        return (
            <div>
                <Nav app={app} setApp={setApp} />
                <main className="studentdashboard block row">
                    <div className="buttons-right">
                        <Link to="/search" className="button">
                            Find Class
                        </Link>
                    </div>
                </main>
                <p className="block row">
                    The StudentDashboard is to be implemented in March.<br/>
                    <LogoutButton app={app} setApp={setApp} isMini={true} />
                </p>
            </div>
        );
    }
}

const LoadingSection = () => (<div><p>Loading...</p></div>);

export default StudentDashboard;
