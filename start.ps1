# Write-Host "Docker not found! Installing..."
# winget install Docker.DockerDesktop

Write-Host "Starting PostgreSQL database..."
cd .\server
docker-compose down -v
docker-compose up --force-recreate --remove-orphans -d

# Write-Host "Starting Express Server..."
# Start-Job -ScriptBlock { npm run server }
# 
# Write-Host "\nStarting React dev client..."
# cd ..\my-app
# Start-Job -ScriptBlock { npm run dev }

cd ..