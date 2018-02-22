import { ajax } from 'jquery';
import React from 'react';
import { log } from '../util/Global.js';
import { Classe } from '../model/Classe.js';
import ClasseSection from '../sections/ClasseSection/ClasseSection.jsx';


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

        let { isMounted, currentAjax, invalid, error, classe,
            sections } = this.state;

        if (isMounted) return false;
        if (currentAjax) return <LoadingSection />;
        if (invalid) return <InvalidSection />;
        if (error || !classe || !sections) return <ErrorSection />;

        return (
            <div>
                <ClasseSection classe={classe}
                    onUpdate={this.setClasse.bind(this)} />
            </div>
        );
    }
}

const Section = ({ p }) => (<section className="block row"><p>{p}</p></section>);
const LoadingSection = () => <Section p="Loading..." />;
const InvalidSection = () => <Section p="This page is either non-existent or private." />;
const ErrorSection = () => <Section p="Sorry, something went wrong." />;

export default ClassePage;
