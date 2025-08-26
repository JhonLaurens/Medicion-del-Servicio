import sys
try:
    import mcp_pandoc
    print("mcp-pandoc importado correctamente")
    print(f"Version: {getattr(mcp_pandoc, '__version__', 'desconocida')}")
except ImportError as e:
    print(f"Error importando mcp-pandoc: {e}")
    sys.exit(1)
except Exception as e:
    print(f"Error general: {e}")
    sys.exit(1)
