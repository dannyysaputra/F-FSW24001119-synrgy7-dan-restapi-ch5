import Knex from 'knex';
import { Model } from 'objection';
import configs from '../knexfile';

// inisialisasi knex
const environment = process.env.NODE_ENV || 'development';
const knexConfig = configs[environment];
const knexInstance = Knex(knexConfig);

// inisialisasi objection.js dengan knex
Model.knex(knexInstance); 

export default knexInstance;