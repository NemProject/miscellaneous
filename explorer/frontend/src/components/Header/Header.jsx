import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { $t } from '../../i18n';
import './Header.scss';

export const Header = () => {
    const location = useLocation();

    const navigationLinks = [{
        text: $t('header_link_home'),
        path: '/'
    }, {
        text: $t('header_link_blocks'),
        path: '/blocks'
    }, {
        text: $t('header_link_transactions'),
        path: '/transactions'
    }];

    const getLinkClassName = link => 'header__navigation-link' + (location.pathname === link.path ? '--active' : '');

    return (
        <Navbar bg="light" expand="md" className="header">
            <Container>
                <Navbar.Brand href="/" className="header__brand">
                    <img src={require('../../assets/images/nem-logo.png')} alt="nem-logo" className="me-2 header__logo"/>
                    <h3>{$t('header_title')}</h3>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {navigationLinks.map(link => (
                            <Nav.Link className={getLinkClassName(link)} as={Link} to={link.path} key={link.text}>
                                {link.text}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

Header.propTypes = {};
