import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './components/Layout';
import DropZone from './components/DropZone';
import Viewer from './components/Viewer';

export default function getRoutes() {
	return (
		<Router history={browserHistory}>
			<Route path='/' component={Layout}>
				<IndexRoute key='route-default' component={DropZone} />
				<Route key='route-viewer' path='/view/:hash' component={Viewer} />
			</Route>
		</Router>
	);
}
