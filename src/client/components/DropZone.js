import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import STLViewer from 'stl-viewer';

import Loading from './Loading';

const uploadEndpoint = '/api/save';

function upload( fileHandle ) {
	const fd = new FormData();
	fd.set( 'model', fileHandle, 'model.stl' );
	return fetch( uploadEndpoint, {
		method: 'POST',
		body: fd
	} );
}

@observer
export default class DropZone extends React.Component {
	@observable file = null;

	@observable preview = null;

	@observable loading = null;

	@observable hasDragOver = false;

	@action dragOverHandler( dragOverEvent ) {
		dragOverEvent.preventDefault();
		this.hasDragOver = true;
	}

	@action dragLeaveHandler() {
		this.hasDragOver = false;
	}

	@action async uploadFile() {
		this.loading = true;
		const res = await upload( this.file );
		const { hash, error } = await res.json();
		if( error ) {
			return console.error( error );
		}
		browserHistory.push( `/view/${hash}` );
	}

	@action async dropHandler( dropEvent ) {
		dropEvent.preventDefault();
		const [ file ] = dropEvent.dataTransfer.files;
		const [ ext ] = file.name.match( /\.[^.]*$/ );
		if( ext.toLowerCase() !== '.stl' ) {
			return console.error( 'can only upload .stl files' );
		}
		this.file = file;
		const reader = new FileReader();
		reader.onload = action( e => {
			this.preview = e.target.result;
		} );
		reader.readAsDataURL( file );
	}

	render() {
		if( this.loading ) {
			return <Loading>Uploading File</Loading>;
		}
		if( this.preview ) {
			return (
				<div>
					<button type='button' onClick={() => this.uploadFile()}>
						upload
					</button>
					<STLViewer
						url={this.preview}
						width={500}
						height={500}
						modelColor='#cc4444'
						backgroundColor='#242424'
						rotate
						orbitControls
					/>
				</div>
			);
		}
		return (
			<div
				className='file-drop-area'
				onDragOver={e => this.dragOverHandler( e )}
				onDragLeave={e => this.dragLeaveHandler( e )}
				onDrop={e => this.dropHandler( e )}
			>
				<span className='file-msg'>
					drag and drop file here <br />
					stl file size limit is 30mb.
				</span>
			</div>
		);
	}
}
