import React from 'react';
import PropTypes from 'prop-types';
import { observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import STLViewer from 'stl-viewer';
import FileLoader from './FileLoader';

@observer
export default class Viewer extends React.Component {
	@observable stl = null;

	async handleFileLoad( response ) {
		try {
			const blob = await response.blob();
			runInAction( () => {
				this.stl = URL.createObjectURL( blob );
			} );
		} catch ( error ) {
			console.error( error );
		}
	}

	downloadFile() {
		const { params: { hash } } = this.props;
		const link = document.createElement( 'a' );
		link.href = this.stl;
		link.download = `${hash}.stl`;
		link.click();
	}

	render() {
		const { params: { hash } } = this.props;
		return (
			<div className='viewer-container'>
				{ !this.stl ?
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
								url={this.stl}
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
