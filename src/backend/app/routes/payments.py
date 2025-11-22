from flask import Blueprint, request, jsonify
from ..services.data_service import list_payments, add_payment
from ._decorators import role_required, login_required

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('', methods=['GET'])
@role_required(['admin', 'accountant'])
def get_payments(user):
    return jsonify(list_payments())


@payments_bp.route('', methods=['POST'])
@login_required
def create_payment(user):
    data = request.json or {}
    # residents may only create payments for their own household
    if user.get('role') == 'resident':
        household_id = user.get('household_id')
    else:
        household_id = data.get('household_id')

    if not household_id or not data.get('fee_id') or not data.get('amount_paid'):
        return jsonify({'message': 'household_id, fee_id and amount_paid required'}), 400

    payment = {
        'household_id': household_id,
        'fee_id': data.get('fee_id'),
        'amount_paid': data.get('amount_paid'),
        'timestamp': data.get('timestamp')
    }
    created = add_payment(payment)
    return jsonify({'message': 'payment recorded', 'payment': created}), 201

