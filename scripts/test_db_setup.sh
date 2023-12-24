psql postgres -U postgres -c "DROP DATABASE test" ; psql postgres -U postgres -c "CREATE DATABASE test" && export FOR_TESTING=y && npx knex migrate:latest
