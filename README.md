# 🏢 BlueMoon - Condominium Management System

Dự án quản lý chung cư (Group 4).
- **Backend:** Flask (Python)
- **Frontend:** Next.js (TypeScript)
# 🛠 Tech Stack
| Component | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | **Flask** | Python Web Framework |
| | **PostgreSQL** | Database |
| | **SQLAlchemy** | ORM |
| **Frontend** | **Next.js 15** | App Router Framework |
| | **TypeScript** | Programming Language |
| | **Tailwind CSS v4** | Styling |
| | **shadcn/ui** | UI Library |
| | **Lucide React** | Icons |

---
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

# 🎨 BlueMoon Frontend

## 1. Project Structure

```
src/frontend/
├── app/
│   ├── (dashboard)/       # Main Layout (Sidebar + Header)
│   │   ├── fees/          # Quản lý thu phí
│   │   ├── households/    # Quản lý hộ khẩu
│   │   └── residents/     # Quản lý nhân khẩu
│   ├── auth/              # Login/Register pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── households/        # Feature-specific components
│   │   ├── CreateHouseholdDialog.tsx
│   │   ├── HouseholdsTable.tsx
│   │   └── ...
│   └── ui/                # Shared components (shadcn/ui)
├── lib/
│   ├── types/             # TypeScript definitions
│   │   ├── household.ts
│   │   ├── residents.ts
│   │   └── fees.ts
│   └── utils.ts           # Utility functions
└── public/
```

## 2. How to Run the Frontend

### **Step 1: Navigate to Frontend Directory**

```bash
cd src/frontend
```

### **Step 2: Install Dependencies**

```bash
npm install
# or
npm i
```

### **Step 3: Environment Variables**

Create file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

### **Step 4: Start Dev Server**

```bash
npm run dev
```

👉 App chạy tại: http://localhost:3000

