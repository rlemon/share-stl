import React from 'react';
import PropTypes from 'prop-types';
import STLViewer from 'stl-viewer';
import Loading from './Loading';

function LoadingOrError( { error } ) {
	if( error ) {
		return <span className='error'>{error.message}</span>;
	}
	return <Loading>Loading File</Loading>;
}

export default class Viewer extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			stl: null,
			error: null
		};
	}

	async componentDidMount() {
		const { params: { hash } } = this.props;
		const res = await fetch( `/api/stl/${hash}`, {
			method: 'GET'
		} );
		if( !res.ok ) {
			try {
				const { error } = await res.json();
				this.setState( { error } );
			} catch ( error ) {
				this.setState( { error } );
			}
			return;
		}
		const blob = await res.blob();
		this.setState( { stl: URL.createObjectURL( blob ) } );
	}

	downloadFile() {
		const { stl } = this.state;
		const { params: { hash } } = this.props;
		const link = document.createElement( 'a' );
		link.href = stl;
		link.download = `${hash}.stl`;
		link.click();
	}

	render() {
		const { error, stl } = this.state;
		return (
			<div className='viewer-container'>
				{
					stl
						? (
							<div>
								<button type='button' onClick={() => this.downloadFile()}>
									download
								</button>
								<STLViewer
									url={stl}
									width={500}
									height={500}
									modelColor='#cc4444'
									backgroundColor='#242424'
									rotate
									orbitControls
								/>
							</div>
						) : <LoadingOrError error={error} />
				}
			</div>
		);
	}
}

Viewer.propTypes = {
	params: PropTypes.object
};

LoadingOrError.propTypes = {
	error: PropTypes.object
};
