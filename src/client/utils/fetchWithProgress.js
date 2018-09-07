export default async function fetchWithProgress( file, options = {}, progressUpdate = null ) {
	try {
		const fileResponse = await fetch( file, options );
		const totalBytes = fileResponse.headers.get( 'content-length' );

		// if there is no content length, we can't calculate any progress.
		// also if there is no provided callback, there is no point.
		if( totalBytes === null || progressUpdate === null ) {
			if( totalBytes === null ) {
				console.error( 'content-length not available' );
			}
			return fileResponse;
		}

		const fileReader = fileResponse.body.getReader();
		let currentBytes = 0;
		const stream = new ReadableStream( {
			async start( controller ) {
				try {
					while( true ) { // eslint-disable-line
						const { done, value } = await fileReader.read(); // eslint-disable-line no-await-in-loop
						if( done ) {
							break;
						}
						currentBytes += value.length;
						controller.enqueue( value );
						progressUpdate( currentBytes / totalBytes );
					}
					controller.close();
					fileReader.releaseLock();
				} catch ( error ) {
					throw error;
				}
			}
		} );
		const streamResponse = new Response( stream );
		return streamResponse;
	} catch ( error ) {
		throw error;
	}
}
