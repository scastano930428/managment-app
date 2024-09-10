import React, { useState, useEffect } from 'react';

const UserDetailsModal = ({ isOpen, onClose, user, onSave, onAdd, isAdmin, isEditor }) => {
  const [editedUser, setEditedUser] = useState(user || {
    id: '',
    name: { first: '', last: '' },
    email: '',
    gender: '',
    role: 'Viewer',
  });

  useEffect(() => {
    setEditedUser(user || {
      id: '',
      name: { first: '', last: '' },
      email: '',
      gender: '',
      role: 'Viewer',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting user:', editedUser);
    if (user) {
      onSave(editedUser);
    } else {
      onAdd(editedUser);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              id="firstName"
              type="text" 
              name="name.first" 
              value={editedUser.name.first} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              required
              readOnly={!isAdmin && !isEditor}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              id="lastName"
              type="text" 
              name="name.last" 
              value={editedUser.name.last} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              required
              readOnly={!isAdmin && !isEditor}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              value={editedUser.email} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              required
              readOnly={!isAdmin && !isEditor}
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              id="gender"
              name="gender" 
              value={editedUser.gender} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
              disabled={!isAdmin && !isEditor}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              id="role"
              name="role" 
              value={editedUser.role} 
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
              disabled={!isAdmin}
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Close
            </button>
            {(isAdmin || isEditor) && (
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {user ? 'Save Changes' : 'Add User'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsModal;