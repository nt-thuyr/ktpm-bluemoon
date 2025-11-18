from flask import Blueprint, request, jsonify
from ..services.data_service import list_fees, add_fee
from ._decorators import role_required

fees_bp = Blueprint('fees', __name__)


@fees_bp.route('', methods=['GET'])
def get_fees():
    return jsonify(list_fees())


@fees_bp.route('', methods=['POST'])
@role_required(['admin', 'accountant'])
def create_fee(user):
    data = request.json or {}
    if not data.get('name') or not data.get('amount'):
        return jsonify({'message': 'name and amount required'}), 400
    fee = {'name': data['name'], 'amount': data['amount'], 'type': data.get('type', 'chungcu')}
    created = add_fee(fee)
    return jsonify({'message': 'fee created', 'fee': created}), 201
