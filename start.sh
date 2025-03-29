#!/bin/bash

set -e

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

print_message() {
  echo -e "${GREEN}[✓] $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
  echo -e "${RED}[✗] $1${NC}"
}

print_step() {
  echo -e "\n${BLUE}===== $1 =====${NC}"
}

check_dependency() {
  if ! command -v $1 &> /dev/null; then
    print_error "$1 no está instalado."
    echo "Instálalo con:"
    echo "$2"
    exit 1
  else
    print_message "$1 está instalado."
  fi
}

confirm() {
  read -p "$1 (s/n): " choice
  case "$choice" in
    s|S ) return 0;;
    * ) return 1;;
  esac
}

print_step "Verificando dependencias necesarias"

check_dependency "node" "Para OpenSUSE Tumbleweed: sudo zypper install nodejs"
check_dependency "npm" "Se instala con Node.js"
check_dependency "docker" "Para OpenSUSE Tumbleweed: sudo zypper install docker"
check_dependency "docker-compose" "Para OpenSUSE Tumbleweed: sudo zypper install docker-compose"
check_dependency "git" "Para OpenSUSE Tumbleweed: sudo zypper install git"

NODE_VERSION=$(node -v)
print_message "Versión de Node.js: $NODE_VERSION"
NPM_VERSION=$(npm -v)
print_message "Versión de NPM: $NPM_VERSION"

if ! docker info &> /dev/null; then
  print_warning "Docker no está corriendo. Intentando iniciarlo..."
  sudo systemctl start docker
  if ! docker info &> /dev/null; then
    print_error "No se pudo iniciar Docker. Inténtalo manualmente: sudo systemctl start docker"
    exit 1
  else
    print_message "Docker iniciado correctamente."
  fi
fi

print_step "Configurando el proyecto"

print_message "Instalando dependencias del proyecto..."
npm install

if [ ! -f .env ]; then
  print_warning "Archivo .env no encontrado. Creando uno desde la plantilla..."
  cat > .env << EOL
# Variables de entorno comunes
DATABASE_URL=mysql://user:password@localhost:3306/blockchain_db

# Variables para conexión a blockchain
SEPOLIA_URL=https://sepolia.infura.io/v3/your-infura-key
POLYGON_MUMBAI_URL=https://polygon-mumbai.infura.io/v3/your-infura-key
PRIVATE_KEY=your-private-key-here

# Variables para base de datos local
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=blockchain_db
EOL
  print_message "Archivo .env creado. Actualiza los valores según sea necesario."
fi

print_step "Configurando base de datos"
if confirm "¿Quieres usar una base de datos local? (MariaDB)"; then
  if ! systemctl is-active --quiet mariadb; then
    print_warning "MariaDB no está corriendo. Intentando iniciarlo..."
    sudo systemctl start mariadb
    if ! systemctl is-active --quiet mariadb; then
      print_error "No se pudo iniciar MariaDB. Intenta manualmente: sudo systemctl start mariadb"
    else
      print_message "MariaDB iniciado correctamente."
    fi
  else
    print_message "MariaDB ya está corriendo."
  fi

  print_warning "Asegúrate de que tu base de datos esté creada con los parámetros del archivo .env"
  if confirm "¿Quieres crear la base de datos ahora?"; then
    DB_NAME=$(grep DB_NAME .env | cut -d '=' -f2)
    DB_USER=$(grep DB_USER .env | cut -d '=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)

    echo "Creando base de datos $DB_NAME y usuario $DB_USER..."
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
    sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
    sudo mysql -e "FLUSH PRIVILEGES;"
    print_message "Base de datos y usuario creados correctamente."
  fi
fi

print_step "Construyendo el proyecto"
npm run build

print_step "Configuración de Docker"
if confirm "¿Quieres iniciar los servicios de Docker?"; then
  npm run docker:up
  print_message "Servicios Docker iniciados correctamente."
else
  print_warning "Los servicios Docker no se han iniciado. Puedes iniciarlos más tarde con 'npm run docker:up'."
fi

# Iniciar el modo desarrollo
print_step "Configuración completa"
if confirm "¿Quieres iniciar el modo de desarrollo ahora?"; then
  npm run dev
else
  print_message "Puedes iniciar el modo de desarrollo más tarde con 'npm run dev'."
fi

print_step "Resumen de configuración"
echo -e "${GREEN}El proyecto ha sido configurado correctamente.${NC}"
echo ""
echo "Comandos disponibles:"
echo -e "${BLUE}npm run dev${NC} - Inicia todos los servicios en modo desarrollo"
echo -e "${BLUE}npm run build${NC} - Construye todos los paquetes"
echo -e "${BLUE}npm run test${NC} - Ejecuta las pruebas"
echo -e "${BLUE}npm run lint${NC} - Verifica la calidad del código"
echo -e "${BLUE}npm run format${NC} - Formatea el código"
echo -e "${BLUE}npm run docker:up${NC} - Inicia los servicios Docker"
echo -e "${BLUE}npm run docker:down${NC} - Detiene los servicios Docker"
echo ""
echo -e "Si encuentras algún problema, consulta la documentación o comunícate con los administradores del proyecto."
echo -e "¡Feliz desarrollo! 🚀"
