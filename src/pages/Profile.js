import React, { useState } from 'react';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+94 77 123 4567'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    alert('Profile updated successfully!');
    // Here you could send updated data to your backend API
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-field">
        <label>Name</label>
        <input 
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
        />
      </div>

      <div className="profile-field">
        <label>Email</label>
        <input 
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
        />
      </div>

      <div className="profile-field">
        <label>Phone Number</label>
        <input 
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />
      </div>

      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default Profile;
