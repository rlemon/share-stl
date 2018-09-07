import { Router } from 'express';
import shortid from 'shortid';
import path from 'path';
import fs from 'fs';
import knex from '../../db/connection';

const router = Router();

const shortIdValidChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$';

shortid.characters( shortIdValidChars );

router.get( '/stl/:hash', async ( req, res ) => {
	const { hash } = req.params;
	try {
		const [ row ] = await knex( 'uploads' ).where( { hash } );
		if( !row.filepath ) {
			return res.status( 404 ).json( { error: { status: 404, message: 'not found' } } );
		}
		fs.stat( row.filepath, ( error, stat ) => {
			if( error ) {
				return console.error( error );
			}
			const readStream = fs.createReadStream( row.filepath );
			readStream.on( 'error', () => {
				res.status( 410 ).json( { error: { status: 410, message: 'file removed' } } );
			} );

			res.set( {
				'Content-Length': stat.size
			} );
			readStream.pipe( res );
		} );
	} catch ( error ) {
		res.status( 404 ).json( { error: { status: 404, message: 'not found' } } );
	}
} );

router.post( '/save', async ( req, res ) => {
	const { model, model: { name, md5 } } = req.files;
	if( !/\.stl$/.test( name ) ) {
		return res.status( 400 ).json( { error: { message: 'must upload stl file' } } );
	}
	const fileName = md5;
	const fileLocation = path.join( __dirname, '../../', 'uploads', fileName );
	const shortCode = shortid.generate();
	try {
		await knex( 'uploads' ).insert( { hash: shortCode, filepath: fileLocation } );
		await model.mv( fileLocation );
	} catch ( error ) {
		res.status( 500 ).json( { error } );
	}
	res.json( { hash: shortCode } );
} );

export default router;
