import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, totalAmount }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    securityCode: ''
  });
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!paymentData.cardNumber || !paymentData.expiryMonth || 
        !paymentData.expiryYear || !paymentData.cardholderName || 
        !paymentData.securityCode) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields',
      });
      return;
    }

    console.log('Processing payment:', paymentData);
    // Handle payment processing here
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Payment processed successfully!',
      confirmButtonText: 'OK'
    }).then(() => {
      onClose();
      navigate('/bookingList');
    });
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2 className="payment-title">Total Amount : {totalAmount} LKR</h2>
        </div>
        
        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label className="form-label">
              Card Number <span className="required">*</span>
            </label>
            <input
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleCardNumberChange}
              className="form-input card-input"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">
                Expiry Month <span className="required">*</span>
              </label>
              <input
                type="text"
                name="expiryMonth"
                value={paymentData.expiryMonth}
                onChange={handleInputChange}
                className="form-input"
                placeholder="MM"
                maxLength="2"
                required
              />
            </div>
            
            <div className="form-group half-width">
              <label className="form-label">
                Expiry Year <span className="required">*</span>
              </label>
              <input
                type="text"
                name="expiryYear"
                value={paymentData.expiryYear}
                onChange={handleInputChange}
                className="form-input"
                placeholder="YY"
                maxLength="2"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Cardholder Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Security Code <span className="required">*</span>
            </label>
            <div className="security-code-group">
              <input
                type="text"
                name="securityCode"
                value={paymentData.securityCode}
                onChange={handleInputChange}
                className="form-input security-input"
                placeholder="123"
                maxLength="3"
                required
              />
              <span className="security-hint">3 digits on back of your card</span>
            </div>
          </div>

          <button type="submit" className="pay-button">
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;