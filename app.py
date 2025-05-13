if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000) 