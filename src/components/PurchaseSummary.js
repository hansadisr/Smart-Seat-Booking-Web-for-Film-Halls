import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import '../styles/PurchaseSummary.css';

const PurchaseSummary = ({ isOpen, onClose, bookingData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    agreeToTerms: false
  });
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms & conditions');
      return;
    }
    console.log('Proceeding with booking:', { ...bookingData, userDetails: formData });
    setShowPayment(true);
  };

  const calculateSubtotal = () => {
    return bookingData.packages.reduce((total, pkg) => {
      const price = parseFloat(pkg.price.replace('LKR ', '').replace(',', ''));
      return total + (price * pkg.count);
    }, 0);
  };

  const internetHandlingFee = 112.00;
  const subtotal = calculateSubtotal();
  const totalAmount = subtotal + internetHandlingFee;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">PURCHASE SUMMARY</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="booking-details">
          <div className="booking-info">
            <div className="film-details">
              <span className="film-name">Film Name</span>
              <div className="show-details">
                <span className="show-date">{bookingData.date}</span>
                <span className="show-time">{bookingData.time}</span>
              </div>
            </div>
          </div>

          <div className="ticket-breakdown">
            {bookingData.packages.filter(pkg => pkg.count > 0).map((pkg, index) => (
              <div key={index} className="ticket-item">
                <span className="ticket-type">
                  {pkg.name} - {bookingData.selectedSeats.filter(seat => 
                    pkg.name === 'Box' ? 
                    (seat.startsWith('A-') || seat.startsWith('B-')) : 
                    (!seat.startsWith('A-') && !seat.startsWith('B-'))
                  ).join(', ')} ({pkg.count} Ticket{pkg.count > 1 ? 's' : ''})
                </span>
                <span className="ticket-price">{pkg.price}</span>
              </div>
            ))}
            
            <div className="fee-item">
              <span className="fee-label">Internet handling fees</span>
              <span className="fee-amount">LKR {internetHandlingFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-summary">
            <div className="payment-row">
              <span className="payment-label">Paid Amount</span>
              <span className="payment-amount">LKR 0.00</span>
            </div>
            <div className="payment-row subtotal">
              <span className="payment-label">Sub total</span>
              <span className="payment-amount">LKR {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleProceed} className="user-details-form">
          <h3 className="form-title">Your Details</h3>
          
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First and Last Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <label htmlFor="agreeToTerms" className="checkbox-label">
              I agree to the terms & conditions
            </label>
          </div>

          <button type="submit" className="proceed-button">
            Proceed
          </button>
        </form>

        <PaymentModal 
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          totalAmount={totalAmount.toFixed(2)}
        />
      </div>
    </div>
  );
};

export default PurchaseSummary;
