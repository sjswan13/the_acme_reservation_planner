const pg = require('pg');
const uuid = require('uuid');
const client = new pg.Client(process.env.DATABASE_URL || 'postgress://localhost/acme_reservation_planner_db');

const createTables = async () => {
  const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;

    CREATE TABLE customers(
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE restaurants(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
      );
    CREATE TABLE reservations(
      id UUID PRIMARY KEY,
      reservation_date TIMESTAMP NOT NULL DEFAULT now(),
      customer_id UUID REFERENCES customers(id) NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      party_count INTEGER NOT NULL
    );
  `;
  await client.query(SQL);
};

const createCustomer = async (name) => {
  const SQL = /*SQL*/ `INSERT INTO customers(id, name) VALUES ($1, $2) RETURNING *`;
  const { rows } = await client.query(SQL, [uuid.v4(), name]);
  return rows[0];
}
const createRestaurant = async (name) => {
  const SQL = /*SQL*/ `INSERT INTO restaurants(id, name) VALUES ($1, $2) RETURNING *`
  const { rows } = await client.query(SQL, [uuid.v4(), name]);
  return rows[0];
}
const createReservation = async ({customer_id, restaurant_id, reservation_date, party_count}) => {
  const SQL = /*SQL*/ `INSERT INTO reservations(id, customer_id, restaurant_id, reservation_date, party_count) VALUES ($1, $2, $3, $4, $5) RETURNING *`
  const { rows } = await client.query(SQL, [uuid.v4(), customer_id, restaurant_id, reservation_date, party_count]);
  return rows;
}

const fetchCustomers = async () => {
  const SQL = /*SQL*/ `SELECT * from customers`
  const { rows } = await client.query(SQL);
  return rows;
}

const fetchRestaurants = async () => {
  const SQL = /*SQL*/ `SELECT * from restaurants`
  const { rows } = await client.query(SQL);
  return rows;
}

const fetchReservations = async () => {
  const SQL = /*SQL*/ `SELECT * from reservations`
  const { rows } = await client.query(SQL);
  return rows;
}

const deleteReservation =  async ({id, customer_id}) => { 
  const SQL = /*SQL*/ `DELETE FROM reservations WHERE id=$1 AND customer_id=$2 RETURNING *`
  await client.query(SQL, [id, customer_id])
}

const seed = async () => {
  await Promise.all([
    createCustomer({name: 'Sally'}),
    createCustomer({name: 'Fred'}),
    createCustomer({name: 'Frank'}),
    createCustomer({name: 'Patricia'}),
    createCustomer({name: 'Jane'}),
    createRestaurant({name: 'The Cork'}),
    createRestaurant({name: 'Zoe Ma Ma'}),
    createRestaurant({name: 'The Kitchen'}),
    createRestaurant({name: 'Tapas'}),
    createRestaurant({name: 'Thai Tom'}),
  ]);
  console.log('customers created:', await fetchCustomers());
  const customers = await fetchCustomers();
  console.log('Restaurants Created:', await fetchRestaurants());
  const restaurants = await fetchRestaurants();

  await Promise.all([
    createReservation({
      customer_id: customers[0].id,
      restaurant_id: restaurants[2].id,
      reservation_date: '2024-05-01',
      party_count: 5,
    }),
    createReservation({
      customer_id: customers[1].id,
      restaurant_id: restaurants[0].id,
      reservation_date: '2024-06-11',
      party_count: 8,
    }),
    createReservation({
      customer_id: customers[2].id,
      restaurant_id: restaurants[1].id,
      reservation_date: '2025-12-13',
      party_count: 2,
    }),
    createReservation({
      customer_id: customers[3].id,
      restaurant_id: restaurants[4].id,
      reservation_date: '2024-11-19',
      party_count: 4,
    }),
    createReservation({
      customer_id: customers[4].id,
      restaurant_id: restaurants[3].id,
      reservation_date: '2024-10-18',
      party_count: 15,
    }),
  ])
  console.log('Reservations created:', await fetchReservations());
}


module.exports = {
  client, 
  createTables, 
  createRestaurant, 
  createCustomer,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  deleteReservation,
  seed
}