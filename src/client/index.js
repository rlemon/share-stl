import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import getStores from './stores';
import getRoutes from './router';

import './styles/styles.scss';

// create the app container
const appContainer = document.createElement( 'div' );
appContainer.id = 'app-container';
document.body.appendChild( appContainer );

const stores = getStores();

configure( { enforceActions: true } );

ReactDOM.render(
	<Provider {...stores}>
		{getRoutes()}
	</Provider>,
	appContainer
);
