import React from 'react';
import UserForm from './UserForm';

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add New User'}</h2>
        <UserForm user={user} onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
};

export default React.memo(UserModal);