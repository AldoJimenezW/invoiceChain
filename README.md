# invoiceChain
# Guía para Desarrolladores

## Requisitos previos

Para trabajar en este proyecto, necesitarás:

- Node.js (v16.x o superior)
- npm (v8.x o superior)
- Docker y docker-compose
- Git
- MariaDB (opcional si usas Docker)

## Primeros pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/mi-proyecto-blockchain.git
   cd mi-proyecto-blockchain
   ```

2. Ejecuta el script de inicio:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

   Este script verificará tus dependencias, configurará el entorno y preparará todo para que puedas empezar a desarrollar.

## Estructura del proyecto

```
mi-proyecto-blockchain/
├── apps/
│   ├── admin/         # Frontend de administradores (React)
│   ├── web/           # Frontend de usuarios (React)
│   └── api/           # Backend (Node.js)
├── packages/
│   ├── ui/            # Componentes compartidos
│   ├── contracts/     # Contratos inteligentes (Solidity)
│   ├── config/        # Configuraciones compartidas
│   └── scripts/       # Scripts compartidos
├── docker/
│   ├── docker-compose.yml
│   └── ...
├── turbo.json
└── package.json
```

## Flujo de trabajo

Este proyecto utiliza [Turborepo](https://turbo.build/repo) para gestionar el monorepo.

### Comandos disponibles

- `npm run dev` - Ejecuta todos los servicios en modo desarrollo
- `npm run build` - Construye todos los paquetes
- `npm run test` - Ejecuta todas las pruebas
- `npm run lint` - Ejecuta el linting en todos los paquetes
- `npm run format` - Formatea todo el código
- `npm run docker:up` - Inicia todos los servicios Docker
- `npm run docker:down` - Detiene todos los servicios Docker

### Blockchain (Ethereum/Polygon)

Para trabajar con contratos inteligentes:

1. Navega a `packages/contracts/`
2. Usa los siguientes comandos:
   - `npx hardhat compile` - Compila los contratos
   - `npx hardhat test` - Ejecuta las pruebas de contratos
   - `npx hardhat run scripts/deploy.ts --network sepolia` - Despliega los contratos en la red de prueba

## Base de datos

Por defecto, este proyecto usa MariaDB. Si estás usando Docker, la base de datos se ejecutará automáticamente.

Para conectarte manualmente:
```bash
mysql -u user -p -h localhost blockchain_db
```

## Resolución de problemas

### El script de inicio falla
- Asegúrate de que tienes instaladas todas las dependencias requeridas.
- Verifica que Docker esté funcionando: `systemctl status docker`.
- Comprueba que MariaDB esté funcionando: `systemctl status mariadb`.

### Problemas con Docker
- Resetea los contenedores: `npm run docker:down && npm run docker:up`.
- Verifica los logs: `docker logs <container-name>`.

### Problemas con los contratos inteligentes
- Asegúrate de tener suficiente ETH/MATIC en la red de prueba.
- Verifica que las variables de entorno SEPOLIA_URL y PRIVATE_KEY estén correctamente configuradas.

## Contribuciones

1. Crea una rama para tu característica: `git checkout -b feature/nueva-caracteristica`
2. Realiza tus cambios y asegúrate de que las pruebas pasen: `npm run test`
3. Confirma tus cambios: `git commit -m 'Añadir nueva característica'`
4. Envía tu rama: `git push origin feature/nueva-caracteristica`
5. Abre una Pull Request

## Enlaces útiles

- [Documentación de Turbo](https://turbo.build/repo/docs)
- [Documentación de React](https://reactjs.org/docs/getting-started.html)
- [Documentación de Hardhat](https://hardhat.org/getting-started/)
- [Red de prueba Sepolia](https://sepolia.etherscan.io/)
- [Red de prueba Mumbai (Polygon)](https://mumbai.polygonscan.com/)
