import React from 'react';
import PropTypes from 'prop-types';
import STLViewer from 'stl-viewer';
import FileLoader from './FileLoader';

export default class Viewer extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			stl: null
		};
	}

	async handleFileLoad( response ) {
		const blob = await response.blob();
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
		const { stl } = this.state;
		const { params: { hash } } = this.props;
		return (
			<div className='viewer-container'>
				{ !stl ?
					<FileLoader
						url={`/api/stl/${hash}`}
						onComplete={response => this.handleFileLoad( response )}
					/> :
					(
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
					)
				}
			</div>
		);
	}
}

Viewer.propTypes = {
	params: PropTypes.object
};
