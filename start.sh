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

    print_step "Ejecutando migraciones y seeds"
    npx turbo run db:migrate:dev
    npx turbo run db:seed

    print_message "Base de datos reiniciada y población completada."
else
    print_step "Iniciando instalación completa"
    cd docker && docker_compose down -v
    docker_compose up -d
    cd ..

    print_message "Esperando a que la base de datos esté lista..."
    sleep 10

    print_step "Instalando dependencias"
    npm install

    print_step "Configurando base de datos"
    npx turbo run db:migrate:dev
    npx turbo run db:seed

    print_message "✅ Setup finalizado, ahora puedes ejecutar 'npm run dev' para iniciar el servidor."
fi
