exports.up = knex => knex.schema.createTable( 'uploads', table => {
	table.increments();
	table.string( 'hash' ).notNullable();
	table.string( 'filepath' ).notNullable();
	table.timestamp( 'uploaded_at' ).notNullable().defaultTo( knex.fn.now() );
} );

exports.down = knex => knex.schema.dropTable( 'uploads' );
