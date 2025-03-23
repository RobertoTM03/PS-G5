# Write-Host "Docker not found! Installing..."
# winget install Docker.DockerDesktop
# winget install ShiningLight.OpenSSL.Light
# & 'C:\Program Files\OpenSSL-Win64\bin\openssl.exe' aes-256-cbc -d -in firebase-service-account.json.enc -out firebase-service-account.json

Write-Host "Starting Back-end services..."
cd .\server
docker-compose down -v
docker-compose up --force-recreate --remove-orphans -d

# Write-Host "Starting React application..."
# cd ..\my-app
# docker-compose down -v
# docker-compose up --force-recreate --remove-orphans -d

cd ..