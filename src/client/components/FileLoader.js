import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import fetchWithProgress from '../utils/fetchWithProgress';

export default class FileLoader extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			percentage: 0,
			error: null
		};
	}

	async componentDidMount() {
		const { url, onComplete = () => {} } = this.props;
		const res = await fetchWithProgress( url, {
			method: 'GET'
		}, percentage => {
			this.setState( { percentage } );
		} );
		if( !res.ok ) {
			try {
				const { error } = await res.json();
				this.setState( { error } );
			} catch ( error ) {
				this.setState( { error } );
			}
		} else {
			onComplete( res );
		}
	}

	render() {
		const { percentage, error } = this.state;
		const message = error ?
			<span>{error.message}</span> :
			<span>Loading file. {Math.round( percentage * 100 )}%</span>;
		return (
			<Loading>
				{message}
			</Loading>
		);
	}
}

FileLoader.propTypes = {
	url: PropTypes.string
};

