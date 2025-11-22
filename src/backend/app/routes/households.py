from flask import Blueprint, request, jsonify
from ..services.data_service import list_households, add_household, list_residents, add_resident
from ._decorators import role_required, login_required

households_bp = Blueprint('households', __name__)


@households_bp.route('', methods=['GET'])
@role_required(['admin', 'accountant'])
def get_households(user):
    return jsonify(list_households())


@households_bp.route('', methods=['POST'])
@role_required(['admin'])
def create_household(user):
    data = request.json or {}
    if not data.get('owner_name') or not data.get('apartment_number'):
        return jsonify({'message': 'owner_name and apartment_number required'}), 400
    h = {'owner_name': data['owner_name'], 'apartment_number': data['apartment_number']}
    created = add_household(h)
    return jsonify({'message': 'household created', 'household': created}), 201


@households_bp.route('/residents', methods=['GET'])
@role_required(['admin', 'accountant'])
def get_residents(user):
    return jsonify(list_residents())


@households_bp.route('/residents', methods=['POST'])
@role_required(['admin'])
def create_resident(user):
    data = request.json or {}
    if not data.get('household_id') or not data.get('name'):
        return jsonify({'message': 'household_id and name required'}), 400
    r = {'household_id': data['household_id'], 'name': data['name'], 'dob': data.get('dob'), 'relationship': data.get('relationship')}
    created = add_resident(r)
    return jsonify({'message': 'resident created', 'resident': created}), 201
