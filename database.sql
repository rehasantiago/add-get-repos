CREATE DATABASE repos_db;

--\c into the database

CREATE TABLE repos(
    id INT PRIMARY KEY,
    name VARCHAR(255),
    html_url VARCHAR(255),
    description VARCHAR(255),
    created_at VARCHAR(255),
    open_issues int,
    watchers int,
    owner VARCHAR(2000)
);