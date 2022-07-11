import * as React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.scss';

export const Footer = () => {
    return (
        <div className="footer">
            <Container className="footer__container">
                <img src={require('../../assets/images/nem-logo.png')} alt="nem-logo" className="footer__logo"/>
            </Container>
        </div>
    );
};

Footer.propTypes = {};
