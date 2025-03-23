
echo "Starting PostgreSQL database..."
cd ./server
docker-compose down -v
docker-compose up --force-recreate --remove-orphans -d
cd ..