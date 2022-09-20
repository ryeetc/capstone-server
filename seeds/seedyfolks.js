// import seed data files, arrays of objects
const userData = require('../seed_data/users_seeds.js');
const medData = require('../seed_data/meds_seeds.js');
const logData = require('../seed_data/log_seeds.js');

exports.seed = function (knex) {
  return knex('user')
    .del()
    .then(function () {
      return knex('user').insert(userData);
    })
    .then(() => {
      return knex('meds').del();
    })
    .then(() => {
      return knex('meds').insert(medData);
    })
    .then(() => {
      return knex('log').del();
    })
    .then(() => {
      return knex('log').insert(logData);
    });

    
};