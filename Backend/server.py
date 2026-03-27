import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",   # archivo:objeto
        host="127.0.0.1",
        port=8088,
        reload=True
    )