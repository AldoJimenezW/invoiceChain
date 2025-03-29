#!/bin/bash

set -e

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

print_step() {
  echo -e "\n${BLUE}===== $1 =====${NC}"
}

print_message() {
  echo -e "${GREEN}[✓] $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
  echo -e "${RED}[✗] $1${NC}"
}

docker_compose() {
    if command -v docker-compose &> /dev/null
    then
        docker-compose "$@"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null
    then
        docker compose "$@"
    else
        print_error "Neither docker-compose nor docker compose found."
        exit 1
    fi
}

check_dependency() {
  if ! command -v $1 &> /dev/null; then
    print_error "$1 no está instalado."
    exit 1
  else
    print_message "$1 está instalado."
  fi
}

run_migrations() {
  print_step "Ejecutando migraciones"
  cd apps/api
  npx ts-node src/db/migrate.ts
  cd ../..
  print_message "Migraciones completadas"
}

run_seeds() {
  print_step "Poblando base de datos"
  cd apps/api
  npx ts-node src/db/seed.ts
  cd ../..
  print_message "Base de datos poblada"
}

print_step "Verificando dependencias"
check_dependency "node"
check_dependency "npm"
check_dependency "docker"

print_step "Verificando si Docker está corriendo"
if ! docker info &> /dev/null; then
  print_warning "Docker no está corriendo. Intentando iniciarlo..."
  if command -v systemctl &> /dev/null; then
    sudo systemctl start docker
    if ! docker info &> /dev/null; then
      print_error "No se pudo iniciar Docker. Inténtalo manualmente."
      exit 1
    fi
  else
    print_error "No se pudo iniciar Docker. Inténtalo manualmente."
    exit 1
  fi
else
  print_message "Docker está corriendo."
fi

if [[ "$1" == "--db" ]]; then
    print_step "Reiniciando solo base de datos"
    cd docker && docker_compose down -v
    docker_compose up -d
    cd ..

    print_message "Esperando a que la base de datos esté lista..."
    sleep 10

    run_migrations
    run_seeds

    print_message "Base de datos reiniciada y población completada."
else
    print_step "Iniciando instalación completa"
    cd docker && docker_compose down -v
    docker_compose up -d
    cd ..

    print_message "Esperando a que la base de datos esté lista..."
    sleep 10

    print_step "Verificando archivo .env"
    if [ ! -f .env ]; then
      print_warning "Archivo .env no encontrado. Creando uno desde la plantilla..."
      cat > .env << EOL
# Variables de entorno comunes
DATABASE_URL=mysql://user:password@localhost:3307/blockchain_db

# Variables para conexión a blockchain
SEPOLIA_URL=https://sepolia.infura.io/v3/your-infura-key
POLYGON_MUMBAI_URL=https://polygon-mumbai.infura.io/v3/your-infura-key
PRIVATE_KEY=your-private-key-here

# Variables para base de datos
DB_HOST=localhost
DB_PORT=3307
DB_USER=user
DB_PASSWORD=password
DB_NAME=blockchain_db
EOL
      print_message "Archivo .env creado. Actualiza los valores según sea necesario."
    fi

    print_step "Instalando dependencias"
    npm install

    # Asegurarse de que la estructura de carpetas existe
    mkdir -p apps/api/src/db
    mkdir -p apps/api/src/routes

    # Crear directorios para contratos si no existen
    mkdir -p packages/contracts/contracts
    mkdir -p packages/contracts/scripts

    run_migrations
    run_seeds

    print_message "✅ Setup finalizado, ahora puedes ejecutar 'npm run dev' para iniciar el servidor."
    print_message "🌐 Adminer disponible en: http://localhost:8080"
    print_message "🛢️ Datos de conexión a MariaDB:"
    print_message "   - Host: localhost"
    print_message "   - Puerto: 3307"
    print_message "   - Usuario: user"
    print_message "   - Contraseña: password"
    print_message "   - Base de datos: blockchain_db"
fi
