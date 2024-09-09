from api import app as api_app

# Point d'entrée principal
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(api_app, host="localhost", port=8000)
