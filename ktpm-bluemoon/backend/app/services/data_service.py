"""
In-memory data layer (no DB). All operations are simple and synchronous.
"""

# Seed data
users = [
    {'id': 1, 'username': 'admin', 'password': 'admin123', 'role': 'admin'},            # Ban quản trị (BQT)
    {'id': 2, 'username': 'accountant', 'password': 'acct123', 'role': 'accountant'},  # Kế toán
    {'id': 3, 'username': 'resident', 'password': 'res123', 'role': 'resident', 'household_id': 1},
]

fees = [
    # example fee types
]

payments = [
    # example payments
]

households = [
    {'id': 1, 'owner_name': 'Nguyen Van A', 'apartment_number': 'A-101'}
]

residents = [
    {'id': 1, 'household_id': 1, 'name': 'Nguyen Van A', 'dob': '1985-01-01', 'relationship': 'owner'}
]

# Data service functions

def find_user_by_username(username):
    return next((u for u in users if u['username'] == username), None)


def get_user(user_id):
    return next((u for u in users if u['id'] == user_id), None)


def list_fees():
    return fees


def add_fee(fee):
    fee['id'] = len(fees) + 1
    fees.append(fee)
    return fee


def list_payments():
    return payments


def add_payment(payment):
    payment['id'] = len(payments) + 1
    payments.append(payment)
    return payment


def list_households():
    return households


def add_household(h):
    h['id'] = len(households) + 1
    households.append(h)
    return h


def list_residents():
    return residents


def add_resident(r):
    r['id'] = len(residents) + 1
    residents.append(r)
    return r
