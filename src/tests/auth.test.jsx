
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';

// Mock components
jest.mock('../components/UserDetailsModal', () => {
  return function DummyUserDetailsModal() {
    return <div data-testid="user-details-modal"></div>;
  };
});

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-role">{user?.role || 'Not logged in'}</div>
      <button onClick={() => login('Admin')}>Login as Admin</button>
      <button onClick={() => login('Editor')}>Login as Editor</button>
      <button onClick={() => login('Viewer')}>Login as Viewer</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('Authentication and Authorization', () => {
  test('login and logout functionality', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-role')).toHaveTextContent('Not logged in');

    fireEvent.click(screen.getByText('Login as Admin'));
    expect(screen.getByTestId('user-role')).toHaveTextContent('Admin');

    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user-role')).toHaveTextContent('Not logged in');
  });

  test('role-based access control', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserList />
        </AuthProvider>
      </MemoryRouter>
    );

    // Login as Viewer
    const { login } = useAuth();
    login('Viewer');

    // Viewer should not see the "Add User" button
    expect(screen.queryByText('Add User')).not.toBeInTheDocument();

    // Login as Admin
    login('Admin');

    // Admin should see the "Add User" button
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });
});