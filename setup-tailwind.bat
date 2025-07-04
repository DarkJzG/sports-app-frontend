@echo off
echo ========= Verificando Node y NPM =========
node -v
if errorlevel 1 (
    echo Node.js no está instalado. Descárgalo desde https://nodejs.org/
    pause
    exit /b
)
npm -v
if errorlevel 1 (
    echo NPM no está funcionando correctamente.
    pause
    exit /b
)

echo ========= Instalando TailwindCSS y dependencias =========
npm install -D tailwindcss postcss autoprefixer

if %errorlevel% NEQ 0 (
    echo Error al instalar tailwindcss. Revisa los permisos o el proxy.
    pause
    exit /b
)

echo ========= Generando tailwind.config.js y postcss.config.js =========
call .\node_modules\.bin\tailwindcss.cmd init -p

if %errorlevel% NEQ 0 (
    echo Error al ejecutar TailwindCSS init.
    pause
    exit /b
)

echo ========= Configuración completada con éxito =========
echo ✅ Ahora edita src\index.css y agrega:
echo.
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
pause
