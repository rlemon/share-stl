import http from 'http';
import express, { Router } from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import apiRouter from './routes/api';
import knex from './db/connection';

const { PORT = 7333, MODE = 'development' } = process.env;
const app = express();
const httpServer = http.createServer( app );
const router = Router();
router.use( '/api', apiRouter );

app.use( fileUpload() );
app.use( express.static( path.join( __dirname, 'assets' ) ) );
app.use( router );

app.use( ( req, res, next ) => {
	res.sendFile( 'index.html', {
		root: path.join( __dirname, 'assets' ),
		headers: {
			'Content-Type': 'text/html'
		}
	}, error => {
		if( error ) {
			next( error );
		}
	} );
} );

if( MODE !== 'production' ) {
	app.use( ( err, req, res ) => {
		console.error( err.stack );
		res.status( err.status || 500 );
		res.json( {
			errors: {
				message: err.message,
				error: err
			}
		} );
	} );
}

app.use( ( err, req, res ) => {
	res.status( err.status || 500 );
	res.json( {
		errors: {
			message: err.message,
			error: {}
		}
	} );
} );

// pls, sir. no more
async function cleanup() {
	try {
		const data = await knex( 'uploads' ).debug().whereRaw( `uploaded_at < CURRENT_TIMESTAMP - interval '7 days'` ); // eslint-disable-line quotes, max-len
		const filepaths = data.map( item => item.filepath );
		for( const filepath of filepaths ) {
			fs.unlink( filepath, err => console.log( err ) );
		}
		try {
			await knex( 'uploads' ).debug().whereIn( 'filepath', filepaths ).delete();
		} catch ( error ) {
			console.error( error );
		} finally {
			setTimeout( cleanup, 10 * 60 * 1000 );
		}
	} catch ( error ) {
		console.error( error );
	}
}

cleanup();

httpServer.listen( PORT, () => {
	console.info( `server started and listening on port ${httpServer.address().port}` );
} );
