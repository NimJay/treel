import React from 'react';
import { Link } from 'react-router-dom';
import VerificationSection from '../sections/VerificationSection.jsx';


const VerificationPage = ({ match, app, setApp }) => (
    <div id='page-verification'>
        <VerificationSection code={match.params.code} setApp={setApp} />
        <nav className='block row'>
            <Link to='/'>Home</Link>
        </nav>
    </div>
);


export default VerificationPage;
