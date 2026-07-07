# The Goonies Installer

Instalador de contenido para Nintendo Switch, desarrollado para la comunidad **Switch ES — The Goonies OS**.

---

## Qué es

The Goonies Installer es una aplicación homebrew para Nintendo Switch con interfaz propia en SDL2, diseñada para simplificar la gestión de contenido en consolas con CFW. Todo desde una interfaz en español (con opción de inglés).

- **Instalar por MTP** — Conecta el cable USB al PC y transfiere archivos directamente, sin necesidad de software adicional en el PC.
- **Juegos Instalados** — Visualiza, gestiona y elimina títulos instalados en la consola.
- **Partidas Guardadas** — Administra las saves de tus juegos.
- **Explorar microSD** — Navegador de archivos de la tarjeta SD.
- **Ajustes** — Idioma, información del sistema y capacidad de la SD.

## Componentes de terceros

Este proyecto utiliza los siguientes componentes de código abierto:

- **[yati](https://github.com/ITotalJustice/sphaira)** — Motor de instalación de NCAs (del proyecto sphaira de ITotalJustice).
- **[libhaze](https://github.com/Atmosphere-NX/Atmosphere)** — Librería MTP del proyecto Atmosphere.
- **[minini](https://github.com/compuphase/minIni)** — Librería para archivos de configuración INI.

La interfaz gráfica (SDL2), el módulo de instalación y la arquitectura general son código original de este proyecto.

## Compilación

### Requisitos

- [devkitPro](https://devkitpro.org/) con el toolchain de Switch (devkitA64)
- Librerías: SDL2, SDL2_ttf, SDL2_image, SDL2_gfx, mbedtls (instalables con `pacman` de devkitPro)

### Pasos

```bash
git clone https://github.com/GoodmanBCN10/The-Goonies-Installer.git
cd The-Goonies-Installer
make -j$(nproc)
```

El archivo resultante `TheGooniesInstaller.nro` se genera en la raíz del proyecto.

### Instalación

Copia `TheGooniesInstaller.nro` a la carpeta `/switch/` de tu microSD.

## Créditos

- **[ITotalJustice](https://github.com/ITotalJustice)** — Autor de yati (motor de instalación) y sphaira.
- **[Atmosphere-NX](https://github.com/Atmosphere-NX)** — Autores de libhaze (librería MTP).
- **GoodmanBCN** — Desarrollo, interfaz y mantenimiento.
- **Comunidad Switch ES — The Goonies OS** — Testing y feedback.

## Licencia

Este proyecto se distribuye bajo la licencia **GPL-3.0**. Consulta el archivo [LICENSE](LICENSE) para los términos completos.
