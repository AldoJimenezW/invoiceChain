@echo off
setlocal enabledelayedexpansion

:: Colores para la consola
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "NC=[0m"

:: Función para imprimir mensajes con formato
call :print_step "Verificando dependencias"
call :check_dependency "node" "Node.js"
call :check_dependency "npm" "npm"
call :check_dependency "docker" "Docker Desktop"

:: Verificar si Docker está corriendo
call :print_step "Verificando si Docker está corriendo"
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    call :print_warning "Docker no está corriendo. Por favor, inicia Docker Desktop manualmente."
    pause
    exit /b 1
) else (
    call :print_message "Docker está corriendo."
)

:: Comprobar argumentos
if "%1"=="--db" (
    call :print_step "Reiniciando solo base de datos"
    cd docker && docker-compose down -v
    docker-compose up -d
    cd ..

    call :print_message "Esperando a que la base de datos esté lista..."
    timeout /t 10 /nobreak >nul

    call :setup_basic_files
    call :run_migrations
    call :run_seeds

    call :print_message "Base de datos reiniciada y población completada."
) else (
    call :print_step "Iniciando instalación completa"
    cd docker && docker-compose down -v
    docker-compose up -d
    cd ..

    call :print_message "Esperando a que la base de datos esté lista..."
    timeout /t 10 /nobreak >nul

    call :print_step "Verificando archivo .env"
    if not exist .env (
        call :print_warning "Archivo .env no encontrado. Creando uno desde la plantilla..."
        (
            echo # Variables para base de datos
            echo DB_HOST=localhost
            echo DB_PORT=3307
            echo DB_USER=user
            echo DB_PASSWORD=password
            echo DB_NAME=blockchain_db
            echo.
            echo # Variables para conexión a blockchain
            echo SEPOLIA_URL=https://sepolia.infura.io/v3/your-infura-key
            echo POLYGON_MUMBAI_URL=https://polygon-mumbai.infura.io/v3/your-infura-key
            echo PRIVATE_KEY=your-private-key-here
        ) > .env
        call :print_message "Archivo .env creado. Actualiza los valores según sea necesario."
    )

    call :print_step "Instalando dependencias"
    call npm install

    call :setup_basic_files
    call :run_migrations
    call :run_seeds

    call :print_message "✅ Setup finalizado, ahora puedes ejecutar 'npm run dev' para iniciar el servidor."
    call :print_message "🌐 Adminer disponible en: http://localhost:8080"
    call :print_message "🛢️ Datos de conexión a MariaDB:"
    call :print_message "   - Host: localhost"
    call :print_message "   - Puerto: 3307"
    call :print_message "   - Usuario: user"
    call :print_message "   - Contraseña: password"
    call :print_message "   - Base de datos: blockchain_db"
)

exit /b 0

:: Funciones
:print_step
    echo.
    echo %BLUE%===== %~1 =====%NC%
    exit /b 0

:print_message
    echo %GREEN%[✓] %~1%NC%
    exit /b 0

:print_warning
    echo %YELLOW%[!] %~1%NC%
    exit /b 0

:print_error
    echo %RED%[✗] %~1%NC%
    exit /b 0

:check_dependency
    where %~1 >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        call :print_error "%~2 no está instalado."
        exit /b 1
    ) else (
        call :print_message "%~2 está instalado."
        exit /b 0
    )

:setup_basic_files
    :: Crear estructura básica
    if not exist apps\api\src\db mkdir apps\api\src\db
    if not exist packages\contracts\contracts mkdir packages\contracts\contracts

    :: Crear migrate.ts si no existe
    if not exist apps\api\src\db\migrate.ts (
        (
            echo import { initDb } from './schema';
            echo.
            echo async function migrate() {
            echo   try {
            echo     await initDb();
            echo     console.log('Migration completed successfully');
            echo     process.exit(0);
            echo   } catch (error) {
            echo     console.error('Migration failed:', error);
            echo     process.exit(1);
            echo   }
            echo }
            echo.
            echo migrate();
        ) > apps\api\src\db\migrate.ts
    )

    :: Crear seed.ts si no existe
    if not exist apps\api\src\db\seed.ts (
        (
            echo import { seedDb } from './schema';
            echo.
            echo async function seed() {
            echo   try {
            echo     await seedDb();
            echo     console.log('Seed completed successfully');
            echo     process.exit(0);
            echo   } catch (error) {
            echo     console.error('Seed failed:', error);
            echo     process.exit(1);
            echo   }
            echo }
            echo.
            echo seed();
        ) > apps\api\src\db\seed.ts
    )

    :: Crear tsconfig.json si no existe
    if not exist apps\api\tsconfig.json (
        (
            echo {
            echo   "compilerOptions": {
            echo     "target": "es2018",
            echo     "module": "commonjs",
            echo     "outDir": "./dist",
            echo     "rootDir": "./src",
            echo     "strict": true,
            echo     "esModuleInterop": true,
            echo     "skipLibCheck": true,
            echo     "forceConsistentCasingInFileNames": true
            echo   },
            echo   "include": ["src/**/*"]
            echo }
        ) > apps\api\tsconfig.json
    )

    :: Crear package.json para la API si no existe
    if not exist apps\api\package.json (
        (
            echo {
            echo   "name": "api",
            echo   "version": "1.0.0",
            echo   "description": "InvoiceChain API",
            echo   "main": "dist/index.js",
            echo   "scripts": {
            echo     "build": "tsc",
            echo     "dev": "nodemon --exec ts-node src/index.ts",
            echo     "start": "node dist/index.js",
            echo     "db:migrate:dev": "ts-node src/db/migrate.ts",
            echo     "db:seed": "ts-node src/db/seed.ts"
            echo   },
            echo   "dependencies": {
            echo     "cors": "^2.8.5",
            echo     "dotenv": "^16.0.3",
            echo     "express": "^4.18.2",
            echo     "mysql2": "^3.3.1"
            echo   },
            echo   "devDependencies": {
            echo     "@types/cors": "^2.8.13",
            echo     "@types/express": "^4.17.17",
            echo     "@types/node": "^20.1.0",
            echo     "nodemon": "^2.0.22",
            echo     "ts-node": "^10.9.1",
            echo     "typescript": "^5.0.4"
            echo   }
            echo }
        ) > apps\api\package.json
    )
    exit /b 0

:run_migrations
    call :print_step "Ejecutando migraciones"
    cd apps\api
    npx ts-node src/db/migrate.ts
    cd ..\..
    call :print_message "Migraciones completadas"
    exit /b 0

:run_seeds
    call :print_step "Poblando base de datos"
    cd apps\api
    npx ts-node src/db/seed.ts
    cd ..\..
    call :print_message "Base de datos poblada"
    exit /b 0
