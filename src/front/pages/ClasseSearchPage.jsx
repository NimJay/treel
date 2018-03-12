import { ajax } from 'jquery';
import React from 'react';
import { Link } from 'react-router-dom';
import { Classe } from '../model/Classe.js';
import { log } from '../util/Global.js';
import Nav from '../components/Nav.jsx';


class ClasseSearchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            displayCantFind: false,
            searchString: "",
            currentAjax: null, // The current AJAX request.
            error: false,
            classes: []
        };
    }

    setSearchString(e) {
        this.setState({ searchString: e.target.value, displayCantFind: true },
            this.search.bind(this, this.state.currentAjaxId));
    }

    search(ajaxId) {
        let { currentAjax, searchString } = this.state;
        if (currentAjax) currentAjax.abort();
        currentAjax = ajax({
            type: 'POST',
            url: '/api/classe/search-classes',
            contentType: 'application/json',
            'data': JSON.stringify({ searchString }),
            'dataType': 'json',
            'success': this.onAjaxSuccess.bind(this),
            'error': this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, classes } = data,
            currentAjax = null;
        error = error || !classes;
        if (classes) classes = classes.map(c => new Classe(c));
        this.setState({ classes, error, currentAjax });
    }
    onAjaxError(error) {
        log(error);
        this.setState({ error: true, currentAjax: null });
    }

    render() {
        let { app, setApp } = this.props,
            { currentAjax, displayCantFind, searchString,
                classes } = this.state;

        classes.sort((a, b) =>
            a.searchScore(searchString) < b.searchScore(searchString) ? 1 : -1);
        let links = classes.map(c => (<ClasseLink classe={c} key={c._id} />));

        return (
            <div>
                {app.isLoggedIn() ? <Nav app={app} setApp={setApp} /> :
                    <nav className="block row"><Link to="/">Home</Link></nav>}
                <main className="classesearchsection block row">
                    <div>
                        <h1>Find a Class</h1>
                        <input type="text" placeholder="Search" autoFocus
                            value={searchString}
                            onChange={this.setSearchString.bind(this)} />
                    </div>
                    {links}
                    {!currentAjax && displayCantFind && links.length == 0 &&
                        searchString.length > 0 && <p>No classes found.</p>}
                </main>
            </div>
        );
    }
}

const ClasseLink = ({ classe }) => (
    <Link to={"/class/" + classe._id} className="classelink">
        <div className="col-1-2">{classe.courseCode}</div>
        <div className="col-1-2">{classe.courseName}</div>
        <div className="col-1">{classe.school.name}</div>
        <div className="col-1">
            {classe.instructors.map(i => i.name).join(', ')}
        </div>
    </Link>
);


export default ClasseSearchPage;
