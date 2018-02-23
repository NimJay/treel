import { ajax } from 'jquery';
import React from 'react';
import Nav from '../components/Nav.jsx';
import { Classe } from '../model/Classe.js';
import ClasseSection from '../sections/ClasseSection/ClasseSection.jsx';
import { log } from '../util/Global.js';


class ClassePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            currentAjax: null,
            invalid: false,
            error: false,
            classe: null,
            sections: null
        };
    }

    componentDidMount() {
        this.setState({
            isMouned: true,
            currentAjax: this.getClasse()
        });
    }

    getClasse() {
        return ajax({
            url: '/api/classe/get-classe',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ classeId:this.props.match.params.classeId }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, classe, sections } = data,
            currentAjax = null;
        if (classe) classe = new Classe(classe);
        let invalid = error && error.code == 4;
        error = !!error;
        this.setState({ error, invalid, currentAjax, classe, sections });
    }
    onAjaxError(error) {
        log(error);
        this.setState({ error: true, currentAjax: null });
    }

    setClasse(classe) {this.setState({ classe });}

    render() {

        let { app, setApp } = this.props,
            { isMounted, currentAjax, invalid, error, classe,
            sections } = this.state;

        if (isMounted) return false;
        if (currentAjax) return <LoadingSection app={app} setApp={setApp} />;
        if (invalid) return <InvalidSection app={app} setApp={setApp} />;
        if (error || !classe || !sections)
            return <ErrorSection app={app} setApp={setApp} />;

        // Only editable to creator and instructors.
        let isEditable = app.isLoggedIn() &&
            (classe.instructors.map(i => i._id) + [classe.creator._id])
                .includes(app.user._id);

        return (
            <div>
                <Nav app={app} setApp={setApp} />
                <ClasseSection classe={classe} isEditable={isEditable}
                    onUpdate={this.setClasse.bind(this)} />
            </div>
        );
    }
}

const Section = ({ p, app, setApp }) => (
    <div>
        <Nav app={app} setApp={setApp} />
        <main className="block row"><p>{p}</p></main>
    </div>
);
const LoadingSection = (props) => <Section p="Loading..." {...props} />;
const InvalidSection = (props) => <Section p="This page is either non-existent or private." {...props} />;
const ErrorSection = (props) => <Section p="Sorry, something went wrong." {...props} />;

export default ClassePage;
