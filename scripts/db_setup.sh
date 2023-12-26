psql postgres -U postgres -c "DROP DATABASE proDB" ; psql postgres -U postgres -c "CREATE DATABASE proDB" && npx knex migrate:latest
