import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, totalAmount, bookingData, userData, onBookingSuccess }) => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    securityCode: ''
  });
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Format card number with spaces
    if (name === 'cardNumber') {
        const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setCardInfo(prev => ({ ...prev, [name]: formattedValue }));
    } else {
        setCardInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsPaying(true);

    try {
      const apiPayload = {
        user_id: parseInt(userId),
        show_id: bookingData.showId,
        seats: bookingData.selectedSeats,
        packages: bookingData.packages,
        total_price: parseFloat(totalAmount),
        phone: userData.mobileNumber,
      };

      const response = await axios.post('http://localhost:8080/api/v1/bookings/create', apiPayload);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your booking is confirmed!',
          confirmButtonText: 'View My Bookings'
        }).then(() => {
          if (onBookingSuccess) onBookingSuccess();
          onClose(); // Close this payment modal
          navigate('/bookingList');
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.response?.data?.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2 className="payment-title">Total Amount: LKR {totalAmount}</h2>
        </div>
        
        {/* THIS IS THE FORM THAT WAS MISSING */}
        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input type="text" name="cardNumber" value={cardInfo.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" maxLength="19" required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Cardholder Name</label>
            <input type="text" name="cardholderName" value={cardInfo.cardholderName} onChange={handleInputChange} placeholder="John Doe" required className="form-input" />
          </div>
          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">
                Expiry Month <span className="required">*</span>
              </label>
              <input
                type="text"
                name="expiryMonth"
                value={cardInfo.expiryMonth}
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
                value={cardInfo.expiryYear}
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
              Security Code (CVV) <span className="required">*</span>
            </label>
            <div className="security-code-group">
              <input
                type="text"
                name="securityCode"
                value={cardInfo.securityCode}
                onChange={handleInputChange}
                className="form-input security-input"
                placeholder="123"
                maxLength="3"
                required
              />
              <span className="security-hint">3 digits on back of your card</span>
            </div>
          </div>
          <button type="submit" className="pay-button" disabled={isPaying}>
            {isPaying ? 'Processing...' : `Pay LKR ${totalAmount}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
