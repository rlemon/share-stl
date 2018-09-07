import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default function Layout( props ) {
	const { children } = props;
	return (
		<div className='wrapper'>
			<div className='navbar'>
				<Link to='/'>Home</Link>
			</div>
			<div className='content-wrapper'>
				{ children }
			</div>
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.node
};
