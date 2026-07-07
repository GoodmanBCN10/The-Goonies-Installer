import re

with open("source/main.cpp", "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ('"Instalar juegos por MTP"', 'GetText("menu_mtp")'),
    ('"Juegos Instalados"', 'GetText("menu_games")'),
    ('"Partidas Guardadas (Saves)"', 'GetText("menu_saves")'),
    ('"Explorar microSD"', 'GetText("menu_explorer")'),
    ('"Ajustes"', 'GetText("menu_settings")'),
    ('"Desconocido"', 'GetText("unknown_game")'),
    ('"No hay juegos instalados o error leyendo ns."', 'GetText("no_games")'),
    ('"Partidas Guardadas (Backup)"', 'GetText("title_saves")'),
    ('"GESTOR DE PARTIDAS"', 'GetText("popup_title")'),
    ('"Ruta SD: sdmc:/GooniesOS_Saves/"', 'GetText("popup_sd_path")'),
    ('"1. Hacer Backup a SD"', 'GetText("popup_opt_backup")'),
    ('"2. Importar desde SD"', 'GetText("popup_opt_restore")'),
    ('"3. Cancelar"', 'GetText("popup_opt_cancel")'),
    ('"Aceptar"', 'GetText("popup_btn_ok")'),
    ('"Copiando a la SD... Espere."', 'GetText("msg_backup_wait")'),
    ('"Backup Completado!"', 'GetText("msg_backup_ok")'),
    ('"Error: No se pudo montar el Save (No hay partida)"', 'GetText("msg_backup_err_mount")'),
    ('"Error: No hay perfil seleccionado"', 'GetText("msg_err_profile")'),
    ('"Restaurando desde la SD... Espere."', 'GetText("msg_restore_wait")'),
    ('"Partida Importada con Exito!"', 'GetText("msg_restore_ok")'),
    ('"Error: No se pudo montar el Save destino"', 'GetText("msg_restore_err_mount")'),
    ('"Error: No hay backup en la SD para este juego"', 'GetText("msg_restore_err_notfound")'),
    ('"Ajustes de la Aplicación"', 'GetText("title_settings")'),
    ('"[ ON ] Tema Oscuro (Solo visual)"', 'GetText("set_dark_on")'),
    ('"[ OFF ] Tema Oscuro (Solo visual)"', 'GetText("set_dark_off")'),
    ('"[ ON ] Vista de Juegos en Cuadrícula"', 'GetText("set_grid_on")'),
    ('"[ OFF ] Vista de Juegos en Cuadrícula (Usar Lista)"', 'GetText("set_grid_off")'),
    ('"(Pulsa A para cambiar, B para volver)"', 'GetText("set_help")'),
    ('"X"', 'GetText("btn_x")'),
    ('"Vista"', 'GetText("btn_view")'),
    ('"A"', 'GetText("btn_a")'),
    ('"Seleccionar"', 'GetText("btn_select")'),
    ('"B"', 'GetText("btn_b")'),
    ('"Volver"', 'GetText("btn_back")')
]

for old, new in replacements:
    content = content.replace(old, new)

# Fix map definition to only 2 languages
content = re.sub(r'\{"([^"]+)", \{"([^"]+)", "([^"]+)", "([^"]+)"\}\}', r'{"\1", {"\2", "\3"}}', content)
content = content.replace('int settingLanguage = 0; // 0=ES, 1=EN, 2=PT', 'int settingLanguage = 0; // 0=ES, 1=EN')

# Add missing dictionary items
missing_items = """
    {"btn_x", {"X", "X"}},
    {"btn_a", {"A", "A"}},
    {"btn_b", {"B", "B"}},
"""
content = content.replace('    {"btn_select", {"Seleccionar", "Select"}},', missing_items + '    {"btn_select", {"Seleccionar", "Select"}},')

with open("source/main.cpp", "w", encoding="utf-8") as f:
    f.write(content)
