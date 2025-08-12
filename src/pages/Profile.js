import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    telephone: ''
  });

  const [originalProfile, setOriginalProfile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('You must be logged in to view this page.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users/get/${userId}`);
        if (response.data.success) {
          const userData = {
            name: response.data.userDetails.name,
            email: response.data.userDetails.email,
            telephone: response.data.userDetails.telephone || ''
          };
          setProfile(userData);
          setOriginalProfile(userData);
        }
      } catch (err) {
        setError('Failed to fetch user data.');
        console.error('Fetch user data error:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/users/update/${userId}`, profile);
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setOriginalProfile(profile);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile.';
      setError(errorMsg);
      console.error('Update profile error:', err);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h2>My Profile</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="profile-field">
          <label>Name</label>
          <input 
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            readOnly={!isEditing}
            className={!isEditing ? 'read-only' : ''}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input 
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className={!isEditing ? 'read-only' : ''}
          />
        </div>

        <div className="profile-field">
          <label>Telephone Number</label>
          <input 
            type="text"
            name="telephone"
            placeholder={isEditing ? 'Add your telephone number' : 'Not Provided'}
            value={profile.telephone}
            onChange={handleChange}
            readOnly={!isEditing}
            className={!isEditing ? 'read-only' : ''}
          />
        </div>

        {isEditing ? (
          <div className="button-group">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="update-btn1" onClick={() => setIsEditing(true)}>
            Update Profile
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
