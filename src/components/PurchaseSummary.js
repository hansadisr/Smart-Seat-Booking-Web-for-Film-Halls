import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PaymentModal from './PaymentModal';
import '../styles/PurchaseSummary.css';

const PurchaseSummary = ({ isOpen, onClose, bookingData }) => {
  const { isLoggedIn } = useAuth();
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    agreeToTerms: false
  });
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn && userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/users/get/${userId}`);
          if (response.data.success) {
            const user = response.data.userDetails;
            setFormData(prev => ({
              ...prev,
              name: user.name,
              email: user.email,
              mobileNumber: user.telephone || '' // Pre-fill phone if available
            }));
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [isOpen, isLoggedIn, userId]); // Rerun if the modal is opened again

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
              <span className="film-name">{bookingData.movieTitle}</span>
              <div className="show-details">
                <span className="show-date">{bookingData.date}</span>
                <span className="show-time">{bookingData.time}</span>
              </div>
            </div>
          </div>

          <div className="ticket-breakdown">
            {bookingData.packages.filter(pkg => pkg.count > 0).map((pkg, index) => {
              // Helper function to extract and format seat numbers
              const getSeatNumbers = (isBox) => {
                return bookingData.selectedSeats
                  .filter(seat => {
                    const isBoxSeat = seat.startsWith('RowA_') || seat.startsWith('RowB_');
                    return isBox ? isBoxSeat : !isBoxSeat;
                  })
                  .map(seat => seat.replace('Row', '').replace('_Seat', '')) // Transforms "RowA_Seat1" to "A1"
                  .join(', ');
              };

              const seatsList = getSeatNumbers(pkg.name === 'Box');
              
              // --- THIS IS THE CORRECTED LOGIC ---
              const unitPrice = parseFloat(pkg.price.replace('LKR ', '').replace(',', ''));
              const lineItemTotal = unitPrice * pkg.count;

              return (
                <div key={index} className="ticket-item">
                  <span className="ticket-type">
                    {pkg.name} - {seatsList} ({pkg.count} Ticket{pkg.count > 1 ? 's' : ''})
                  </span>
                  <span className="ticket-price">LKR {lineItemTotal.toFixed(2)}</span>
                </div>
              );
            })}
            
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
              name="name"
              placeholder="Name"
              value={formData.name}
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
          bookingData={bookingData}
          userData={formData}
        />
      </div>
    </div>
  );
};

export default PurchaseSummary;
