import React from 'react';
import { Link } from 'react-router-dom';


const AboutPage = () => (
    <div id="page-about">
        <main className="block row">
            <Link to="/"><img src="/favicon.png" alt="Treel Logo, a 2D graphic of a tree" /></Link>
            <h1>Treel</h1>
            <p>Treel is a minimalistic <em>learning management system</em> that allows instructors to distribute course content to students.</p>
            <p>It was created as a school project by <a href="http://individual.utoronto.ca/nim" target="_blank">Nimesha Jayawardena</a> via the surpervision of <a href="http://www.cs.utoronto.ca/~ylzhang/" target="_blank">Professor Larry Zhang</a>. The source code can be found on <a href="https://github.com/NimJay/treel" target="_blank">Github</a>.</p>
            <div className="buttons-left"><Link to="/" className="button">Login</Link> or <Link to="/sign-up">sign up here</Link>.</div>
        </main>
    </div>
);

export default AboutPage;
