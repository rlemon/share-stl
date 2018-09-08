import React from 'react';
import PropTypes from 'prop-types';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import Loading from './Loading';
import fetchWithProgress from '../utils/fetchWithProgress';

@observer
export default class FileLoader extends React.Component {
	@observable percentage = 0;

	@observable error = null;

	async componentDidMount() {
		try {
			const { url, onComplete = () => {} } = this.props;
			const res = await fetchWithProgress( url, {
				method: 'GET'
			}, action( percentage => {
				this.percentage = percentage;
			} ) );
			if( !res.ok ) {
				try {
					const { error } = await res.json();
					runInAction( () => {
						this.error = error;
					} );
				} catch ( error ) {
					runInAction( () => {
						this.error = error;
					} );
				}
			} else {
				onComplete( res );
			}
		} catch ( error ) {
			console.error( error );
		}
	}

	render() {
		const message = this.error ?
			<span>{this.error.message}</span> :
			<span>Loading file. {Math.round( this.percentage * 100 )}%</span>;
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

