import knex from 'knex';
import knexConfig from '../knexfile'; // eslint-disable-line

const { MODE = 'development' } = process.env;

export default knex( knexConfig[MODE] );
