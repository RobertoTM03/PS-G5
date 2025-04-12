# Write-Host "Docker not found! Installing..."
# winget install Docker.DockerDesktop
# winget install ShiningLight.OpenSSL.Light
# & 'C:\Program Files\OpenSSL-Win64\bin\openssl.exe' aes-256-cbc -d -in firebase-service-account.json.enc -out firebase-service-account.json

docker-compose down -v
docker-compose up --build --force-recreate --remove-orphans -d
docker image prune -f