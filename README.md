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

  Ahora puedes correr el proyecto con
  ```bash
  npm run dev
  ```
## En caso de que estes en windows

1. Clona el repositorio

2. ejecura el script de inicio
    ```bash
    start.bat
    ```

Ahora puedes correr el proyecto con
```bash
npm run dev
```

## Pull Request

1. Formatear y lintear
    ```bash
    npm run format
    npm run lint
    ```

2. Buildear el proyecto
    ```bash
    npm run build
    ```

3. Correr las pruebas // en caso de que no existan saltar este paso
    ```bash
    npm run test
    ```

4. En caso de pasar todos los pasos, subir los cambios a la branch y subir la pull request

## Estructura del proyecto

```
invoiceChain/
├── .env                               # Variables de entorno
├── .gitignore                         # Archivos a ignorar en Git
├── docker/                            # Configuración de Docker
│   └── docker-compose.yml             # Definición de servicios en Docker
├── apps/                              # Aplicaciones del monorepo
│   ├── api/                           # API backend
│   │   ├── package.json               # Dependencias y scripts de la API
│   │   ├── tsconfig.json              # Configuración de TypeScript
│   │   └── src/                       # Código fuente de la API
│   │       ├── index.ts               # Punto de entrada de la API
│   │       ├── db/                    # Configuración de base de datos
│   │       │   ├── schema.ts          # Definición de tablas y conexión
│   │       │   ├── migrate.ts         # Script de migración
│   │       │   └── seed.ts            # Script para poblar con datos iniciales
│   │       ├── routes/                # Rutas de la API
│   │       │   ├── users.ts           # Rutas para usuarios
│   │       │   ├── invoices.ts        # Rutas para facturas
│   │       │   └── transactions.ts    # Rutas para transacciones
│   │       └── entity/                # Definiciones de entidades
│   │           ├── User.ts            # Entidad de usuario
│   │           ├── Invoice.ts         # Entidad de factura
│   │           └── Transaction.ts     # Entidad de transacción
│   ├── web/                           # Frontend para usuarios
│   │   ├── package.json               # Dependencias del frontend de usuarios
│   │   ├── tsconfig.json              # Configuración TypeScript
│   │   ├── vite.config.ts             # Configuración de Vite
│   │   ├── index.html                 # HTML base
│   │   └── src/                       # Código fuente
│   │       ├── main.tsx               # Punto de entrada
│   │       ├── App.tsx                # Componente principal
│   │       ├── components/            # Componentes reutilizables
│   │       ├── pages/                 # Páginas de la aplicación
│   │       ├── hooks/                 # Hooks personalizados
│   │       ├── services/              # Servicios (API, blockchain)
│   │       └── assets/                # Imágenes, estilos, etc.
│   └── admin/                         # Frontend para administradores
│       ├── package.json               # Dependencias del frontend de admin
│       ├── tsconfig.json              # Configuración TypeScript
│       ├── vite.config.ts             # Configuración de Vite
│       ├── index.html                 # HTML base
│       └── src/                       # Código fuente
│           ├── main.tsx               # Punto de entrada
│           ├── App.tsx                # Componente principal
│           ├── components/            # Componentes reutilizables
│           ├── pages/                 # Páginas de administración
│           ├── hooks/                 # Hooks personalizados
│           ├── services/              # Servicios (API, blockchain)
│           └── assets/                # Imágenes, estilos, etc.
├── packages/                          # Paquetes compartidos o módulos
│   ├── ui/                            # Componentes de UI compartidos
│   │   ├── package.json               # Dependencias del paquete UI
│   │   ├── tsconfig.json              # Configuración TypeScript
│   │   └── src/                       # Componentes compartidos
│   │       ├── Button/                # Componente Button
│   │       ├── Card/                  # Componente Card
│   │       ├── Input/                 # Componente Input
│   │       └── index.ts               # Exportaciones
│   └── contracts/                     # Contratos inteligentes
│       ├── package.json               # Dependencias para contratos
│       ├── hardhat.config.ts          # Configuración de Hardhat
│       ├── contracts/                 # Directorio para tus contratos Solidity
│       │   ├── InvoiceContract.sol    # Contrato principal de facturas
│       │   └── PaymentToken.sol       # Contrato de token de pago
│       ├── scripts/                   # Scripts de despliegue
│       │   └── deploy.ts              # Script de despliegue
│       └── test/                      # Pruebas de contratos
│           └── InvoiceContract.test.ts # Tests del contrato de facturas
├── package.json                       # Dependencias y scripts del monorepo
├── turbo.json                         # Configuración de Turborepo
└── start.sh                           # Script de inicialización
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

```
invoiceChain
├─   web
├─ .eslintrc.js
├─ .prettierignore
├─ .prettierrc
├─ README.md
├─ apps
│  ├─ admin
│  │  ├─ README.md
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ public
│  │  │  └─ vite.svg
│  │  ├─ src
│  │  │  ├─ App.tsx
│  │  │  └─ main.tsx
│  │  ├─ tsconfig.app.json
│  │  ├─ tsconfig.json
│  │  ├─ tsconfig.node.json
│  │  └─ vite.config.ts
│  ├─ api
│  │  ├─ better-auth_migrations
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  ├─ cards.ts
│  │  │  │  ├─ invoices.ts
│  │  │  │  ├─ reviews.ts
│  │  │  │  ├─ transactions.ts
│  │  │  │  └─ users.ts
│  │  │  ├─ db
│  │  │  │  ├─ migrate.ts
│  │  │  │  ├─ schema.ts
│  │  │  │  └─ seed.ts
│  │  │  ├─ index.ts
│  │  │  ├─ lib
│  │  │  │  └─ auth.ts
│  │  │  ├─ types
│  │  │  │  └─ db.ts
│  │  │  └─ utils
│  │  │     └─ verifySession.ts
│  │  └─ tsconfig.json
│  └─ web
│     ├─ README.md
│     ├─ app
│     │  ├─ auth
│     │  │  ├─ forgot-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ reset-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ signin
│     │  │  │  └─ page.tsx
│     │  │  └─ signup
│     │  │     └─ page.tsx
│     │  ├─ dashboard
│     │  │  ├─ change-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ edit-profile
│     │  │  │  └─ page.tsx
│     │  │  ├─ page.tsx
│     │  │  ├─ profile
│     │  │  │  └─ page.tsx
│     │  │  └─ users
│     │  │     └─ page.tsx
│     │  ├─ favicon.ico
│     │  ├─ globals.css
│     │  ├─ page.tsx
│     │  └─ user
│     │     └─ [id]
│     │        └─ page.tsx
│     ├─ bun.lock
│     ├─ components
│     │  ├─ icon.tsx
│     │  └─ ui
│     │     ├─ EmblaCarousel.tsx
│     │     ├─ EmblaCarouselArrowButtons.tsx
│     │     ├─ accordion.tsx
│     │     ├─ alert-dialog.tsx
│     │     ├─ alert.tsx
│     │     ├─ aspect-ratio.tsx
│     │     ├─ avatar.tsx
│     │     ├─ badge.tsx
│     │     ├─ breadcrumb.tsx
│     │     ├─ button.tsx
│     │     ├─ calendar.tsx
│     │     ├─ card.tsx
│     │     ├─ carousel.tsx
│     │     ├─ chart.tsx
│     │     ├─ checkbox.tsx
│     │     ├─ collapsible.tsx
│     │     ├─ command.tsx
│     │     ├─ context-menu.tsx
│     │     ├─ dialog.tsx
│     │     ├─ drawer.tsx
│     │     ├─ dropdown-menu.tsx
│     │     ├─ form.tsx
│     │     ├─ hover-card.tsx
│     │     ├─ input-otp.tsx
│     │     ├─ input.tsx
│     │     ├─ label.tsx
│     │     ├─ menubar.tsx
│     │     ├─ navigation-menu.tsx
│     │     ├─ pagination.tsx
│     │     ├─ popover.tsx
│     │     ├─ progress.tsx
│     │     ├─ radio-group.tsx
│     │     ├─ resizable.tsx
│     │     ├─ scroll-area.tsx
│     │     ├─ select.tsx
│     │     ├─ separator.tsx
│     │     ├─ sheet.tsx
│     │     ├─ sidebar.tsx
│     │     ├─ skeleton.tsx
│     │     ├─ slider.tsx
│     │     ├─ sonner.tsx
│     │     ├─ switch.tsx
│     │     ├─ table.tsx
│     │     ├─ tabs.tsx
│     │     ├─ textarea.tsx
│     │     ├─ toggle-group.tsx
│     │     ├─ toggle.tsx
│     │     └─ tooltip.tsx
│     ├─ components.json
│     ├─ emails
│     │  └─ reset-password.tsx
│     ├─ eslint.config.mjs
│     ├─ hooks
│     │  └─ use-mobile.ts
│     ├─ lib
│     │  ├─ auth.ts
│     │  ├─ axios.ts
│     │  ├─ constants.ts
│     │  └─ utils.ts
│     ├─ middleware.ts
│     ├─ next-env.d.ts
│     ├─ next.config.ts
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  ├─ bg.jpg
│     │  ├─ file.svg
│     │  ├─ globe.svg
│     │  ├─ next.svg
│     │  ├─ vercel.svg
│     │  └─ window.svg
│     └─ tsconfig.json
├─ bun.lockb
├─ docker
│  └─ docker-compose.yml
├─ jest.config.js
├─ package.json
├─ packages
│  └─ contracts
│     ├─ README.md
│     ├─ contracts
│     │  ├─ InvoiceContract.sol
│     │  ├─ Lock.sol
│     │  ├─ PaymentToken.sol
│     │  ├─ SimpleToken.sol
│     │  └─ scripts
│     │     └─ deploy.ts
│     ├─ hardhat.config.ts
│     ├─ ignition
│     │  └─ modules
│     │     └─ Lock.ts
│     ├─ package.json
│     ├─ scripts
│     ├─ test
│     │  └─ Lock.ts
│     └─ tsconfig.json
├─ start.bat
├─ start.sh
└─ turbo.json

```
```
invoiceChain
├─   web
├─ .eslintrc.js
├─ .prettierignore
├─ .prettierrc
├─ README.md
├─ apps
│  ├─ admin
│  │  ├─ README.md
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ public
│  │  │  └─ vite.svg
│  │  ├─ src
│  │  │  ├─ App.tsx
│  │  │  └─ main.tsx
│  │  ├─ tsconfig.app.json
│  │  ├─ tsconfig.json
│  │  ├─ tsconfig.node.json
│  │  └─ vite.config.ts
│  ├─ api
│  │  ├─ better-auth_migrations
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  ├─ cards.ts
│  │  │  │  ├─ invoices.ts
│  │  │  │  ├─ reviews.ts
│  │  │  │  ├─ transactions.ts
│  │  │  │  └─ users.ts
│  │  │  ├─ db
│  │  │  │  ├─ migrate.ts
│  │  │  │  ├─ schema.ts
│  │  │  │  └─ seed.ts
│  │  │  ├─ index.ts
│  │  │  ├─ lib
│  │  │  │  └─ auth.ts
│  │  │  ├─ types
│  │  │  │  └─ db.ts
│  │  │  └─ utils
│  │  │     └─ verifySession.ts
│  │  └─ tsconfig.json
│  └─ web
│     ├─ README.md
│     ├─ app
│     │  ├─ auth
│     │  │  ├─ forgot-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ reset-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ signin
│     │  │  │  └─ page.tsx
│     │  │  └─ signup
│     │  │     └─ page.tsx
│     │  ├─ dashboard
│     │  │  ├─ change-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ edit-profile
│     │  │  │  └─ page.tsx
│     │  │  ├─ page.tsx
│     │  │  ├─ profile
│     │  │  │  └─ page.tsx
│     │  │  └─ users
│     │  │     └─ page.tsx
│     │  ├─ favicon.ico
│     │  ├─ globals.css
│     │  ├─ page.tsx
│     │  └─ user
│     │     └─ [id]
│     │        └─ page.tsx
│     ├─ bun.lock
│     ├─ components
│     │  ├─ icon.tsx
│     │  └─ ui
│     │     ├─ EmblaCarousel.tsx
│     │     ├─ EmblaCarouselArrowButtons.tsx
│     │     ├─ accordion.tsx
│     │     ├─ alert-dialog.tsx
│     │     ├─ alert.tsx
│     │     ├─ aspect-ratio.tsx
│     │     ├─ avatar.tsx
│     │     ├─ badge.tsx
│     │     ├─ breadcrumb.tsx
│     │     ├─ button.tsx
│     │     ├─ calendar.tsx
│     │     ├─ card.tsx
│     │     ├─ carousel.tsx
│     │     ├─ chart.tsx
│     │     ├─ checkbox.tsx
│     │     ├─ collapsible.tsx
│     │     ├─ command.tsx
│     │     ├─ context-menu.tsx
│     │     ├─ dialog.tsx
│     │     ├─ drawer.tsx
│     │     ├─ dropdown-menu.tsx
│     │     ├─ form.tsx
│     │     ├─ hover-card.tsx
│     │     ├─ input-otp.tsx
│     │     ├─ input.tsx
│     │     ├─ label.tsx
│     │     ├─ menubar.tsx
│     │     ├─ navigation-menu.tsx
│     │     ├─ pagination.tsx
│     │     ├─ popover.tsx
│     │     ├─ progress.tsx
│     │     ├─ radio-group.tsx
│     │     ├─ resizable.tsx
│     │     ├─ scroll-area.tsx
│     │     ├─ select.tsx
│     │     ├─ separator.tsx
│     │     ├─ sheet.tsx
│     │     ├─ sidebar.tsx
│     │     ├─ skeleton.tsx
│     │     ├─ slider.tsx
│     │     ├─ sonner.tsx
│     │     ├─ switch.tsx
│     │     ├─ table.tsx
│     │     ├─ tabs.tsx
│     │     ├─ textarea.tsx
│     │     ├─ toggle-group.tsx
│     │     ├─ toggle.tsx
│     │     └─ tooltip.tsx
│     ├─ components.json
│     ├─ emails
│     │  └─ reset-password.tsx
│     ├─ eslint.config.mjs
│     ├─ hooks
│     │  └─ use-mobile.ts
│     ├─ lib
│     │  ├─ auth.ts
│     │  ├─ axios.ts
│     │  ├─ constants.ts
│     │  └─ utils.ts
│     ├─ middleware.ts
│     ├─ next-env.d.ts
│     ├─ next.config.ts
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  ├─ bg.jpg
│     │  ├─ file.svg
│     │  ├─ globe.svg
│     │  ├─ next.svg
│     │  ├─ vercel.svg
│     │  └─ window.svg
│     └─ tsconfig.json
├─ bun.lockb
├─ docker
│  └─ docker-compose.yml
├─ jest.config.js
├─ package.json
├─ packages
│  └─ contracts
│     ├─ README.md
│     ├─ contracts
│     │  ├─ InvoiceContract.sol
│     │  ├─ Lock.sol
│     │  ├─ PaymentToken.sol
│     │  ├─ SimpleToken.sol
│     │  └─ scripts
│     │     └─ deploy.ts
│     ├─ hardhat.config.ts
│     ├─ ignition
│     │  └─ modules
│     │     └─ Lock.ts
│     ├─ package.json
│     ├─ scripts
│     ├─ test
│     │  └─ Lock.ts
│     └─ tsconfig.json
├─ start.bat
├─ start.sh
└─ turbo.json

```
```
invoiceChain
├─   web
├─ .eslintrc.js
├─ .prettierignore
├─ .prettierrc
├─ README.md
├─ apps
│  ├─ admin
│  │  ├─ README.md
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ public
│  │  │  └─ vite.svg
│  │  ├─ src
│  │  │  ├─ App.tsx
│  │  │  └─ main.tsx
│  │  ├─ tsconfig.app.json
│  │  ├─ tsconfig.json
│  │  ├─ tsconfig.node.json
│  │  └─ vite.config.ts
│  ├─ api
│  │  ├─ better-auth_migrations
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  ├─ cards.ts
│  │  │  │  ├─ invoices.ts
│  │  │  │  ├─ reviews.ts
│  │  │  │  ├─ transactions.ts
│  │  │  │  └─ users.ts
│  │  │  ├─ db
│  │  │  │  ├─ migrate.ts
│  │  │  │  ├─ schema.ts
│  │  │  │  └─ seed.ts
│  │  │  ├─ index.ts
│  │  │  ├─ lib
│  │  │  │  └─ auth.ts
│  │  │  ├─ types
│  │  │  │  └─ db.ts
│  │  │  └─ utils
│  │  │     └─ verifySession.ts
│  │  └─ tsconfig.json
│  └─ web
│     ├─ README.md
│     ├─ app
│     │  ├─ auth
│     │  │  ├─ forgot-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ reset-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ signin
│     │  │  │  └─ page.tsx
│     │  │  └─ signup
│     │  │     └─ page.tsx
│     │  ├─ dashboard
│     │  │  ├─ change-password
│     │  │  │  └─ page.tsx
│     │  │  ├─ edit-profile
│     │  │  │  └─ page.tsx
│     │  │  ├─ page.tsx
│     │  │  ├─ profile
│     │  │  │  └─ page.tsx
│     │  │  └─ users
│     │  │     └─ page.tsx
│     │  ├─ favicon.ico
│     │  ├─ globals.css
│     │  ├─ page.tsx
│     │  └─ user
│     │     └─ [id]
│     │        └─ page.tsx
│     ├─ bun.lock
│     ├─ components
│     │  ├─ icon.tsx
│     │  └─ ui
│     │     ├─ EmblaCarousel.tsx
│     │     ├─ EmblaCarouselArrowButtons.tsx
│     │     ├─ accordion.tsx
│     │     ├─ alert-dialog.tsx
│     │     ├─ alert.tsx
│     │     ├─ aspect-ratio.tsx
│     │     ├─ avatar.tsx
│     │     ├─ badge.tsx
│     │     ├─ breadcrumb.tsx
│     │     ├─ button.tsx
│     │     ├─ calendar.tsx
│     │     ├─ card.tsx
│     │     ├─ carousel.tsx
│     │     ├─ chart.tsx
│     │     ├─ checkbox.tsx
│     │     ├─ collapsible.tsx
│     │     ├─ command.tsx
│     │     ├─ context-menu.tsx
│     │     ├─ dialog.tsx
│     │     ├─ drawer.tsx
│     │     ├─ dropdown-menu.tsx
│     │     ├─ form.tsx
│     │     ├─ hover-card.tsx
│     │     ├─ input-otp.tsx
│     │     ├─ input.tsx
│     │     ├─ label.tsx
│     │     ├─ menubar.tsx
│     │     ├─ navigation-menu.tsx
│     │     ├─ pagination.tsx
│     │     ├─ popover.tsx
│     │     ├─ progress.tsx
│     │     ├─ radio-group.tsx
│     │     ├─ resizable.tsx
│     │     ├─ scroll-area.tsx
│     │     ├─ select.tsx
│     │     ├─ separator.tsx
│     │     ├─ sheet.tsx
│     │     ├─ sidebar.tsx
│     │     ├─ skeleton.tsx
│     │     ├─ slider.tsx
│     │     ├─ sonner.tsx
│     │     ├─ switch.tsx
│     │     ├─ table.tsx
│     │     ├─ tabs.tsx
│     │     ├─ textarea.tsx
│     │     ├─ toggle-group.tsx
│     │     ├─ toggle.tsx
│     │     └─ tooltip.tsx
│     ├─ components.json
│     ├─ emails
│     │  └─ reset-password.tsx
│     ├─ eslint.config.mjs
│     ├─ hooks
│     │  └─ use-mobile.ts
│     ├─ lib
│     │  ├─ auth.ts
│     │  ├─ axios.ts
│     │  ├─ constants.ts
│     │  └─ utils.ts
│     ├─ middleware.ts
│     ├─ next-env.d.ts
│     ├─ next.config.ts
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  ├─ bg.jpg
│     │  ├─ file.svg
│     │  ├─ globe.svg
│     │  ├─ next.svg
│     │  ├─ vercel.svg
│     │  └─ window.svg
│     └─ tsconfig.json
├─ bun.lockb
├─ docker
│  └─ docker-compose.yml
├─ jest.config.js
├─ package.json
├─ packages
│  └─ contracts
│     ├─ README.md
│     ├─ contracts
│     │  ├─ InvoiceContract.sol
│     │  ├─ Lock.sol
│     │  ├─ PaymentToken.sol
│     │  ├─ SimpleToken.sol
│     │  └─ scripts
│     │     └─ deploy.ts
│     ├─ hardhat.config.ts
│     ├─ ignition
│     │  └─ modules
│     │     └─ Lock.ts
│     ├─ package.json
│     ├─ scripts
│     ├─ test
│     │  └─ Lock.ts
│     └─ tsconfig.json
├─ start.bat
├─ start.sh
└─ turbo.json

```