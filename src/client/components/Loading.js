import React from 'react';
import PropTypes from 'prop-types';

export default function Loading( props ) {
	const { children } = props;
	return (
		<div className='boxLoadingContainer'>
			<div className='boxLoadingIcon' />
			<div className='boxLoadingText'>
				{children || 'Please wait'}
			</div>
		</div>
	);
}

Loading.propTypes = {
	children: PropTypes.node
};

