import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Cambiar al directorio del proyecto
project_dir = r"c:\repos\Medicion-del-Servicio"
os.chdir(project_dir)

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

print(f"Iniciando servidor en el puerto {PORT}")
print(f"Directorio: {os.getcwd()}")
print(f"Archivos disponibles:")
for file in os.listdir("."):
    print(f"  - {file}")

try:
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"\nServidor ejecutándose en http://localhost:{PORT}")
        print("Presiona Ctrl+C para detener el servidor")
        
        # Abrir el navegador automáticamente
        webbrowser.open(f"http://localhost:{PORT}")
        
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServidor detenido")
except Exception as e:
    print(f"Error: {e}")