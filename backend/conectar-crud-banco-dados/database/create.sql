CREATE SCHEMA store;

CREATE TABLE store.clients (
    id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	birthdate DATE NOT NULL
);