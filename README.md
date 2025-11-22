# BlueMoon Backend 

## 1. Project Structure

    backend/
    ├── app/
    │   ├── __init__.py
    │   ├── config.py
    │   ├── extensions.py
    │   ├── models/
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   └── utils/
    ├── instance/
    │   └── config.py
    ├── migrations/
    └── run.py

---

## 2. How to Run the Backend
    # Create a virtual environment (1 time setup)
    python -m venv venv

    # Activate virtual environment
    source venv/bin/activate
    hoặc
    .\venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt

    # Set FLASK_APP
    export FLASK_APP=run.py
    hoặc
    $env:FLASK_APP = "src/backend/run.py"

    # Create database (PostgreSQL)
    CREATE DATABASE bluemoon_db;

### 2.1 Configure instance/config.py

Before running migrations, create or edit:

    backend/instance/config.py

Add the following settings:

    SQLALCHEMY_DATABASE_URI = "postgresql://<username>:<password>@localhost:5432/bluemoon_db"
    SECRET_KEY = "your-secret-key"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

Example (default PostgreSQL user):

    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:123456@localhost:5432/bluemoon_db"

*Note:*  
`instance/config.py` is private and is ignored by Git.  
Each developer must create/update this file locally.

---

## 2.2 Run Database Migrations

    flask db init
    flask db migrate -m "initial"
    flask db upgrade

---

## 2.3 Start the Server

    flask run

Server will run at:

    http://127.0.0.1:5000

---

## 3. Available APIs (Module: NhanKhau)

Base URL:
    
    /nhan-khau

Endpoints:

    GET     /nhan-khau/          → Get all records
    GET     /nhan-khau/<id>      → Get record by ID
    POST    /nhan-khau/          → Create new record
    PUT     /nhan-khau/<id>      → Update record
    DELETE  /nhan-khau/<id>      → Delete record

---
