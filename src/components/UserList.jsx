
import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserDetailsModal from './UserDetailsModal';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, Edit, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install this package: npm install uuid

const initialState = {
  users: [],
  currentPage: 1,
  usersPerPage: 10,
  searchTerm: '',
  genderFilter: '',
  roleFilter: '',
  sortConfig: { key: null, direction: 'ascending' },
  selectedUser: null,
  isModalOpen: false,
  error: null,
};

const userListReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload, error: null };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_USERS_PER_PAGE':
      return { ...state, usersPerPage: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_GENDER_FILTER':
      return { ...state, genderFilter: action.payload };
    case 'SET_ROLE_FILTER':
      return { ...state, roleFilter: action.payload };
    case 'SET_SORT_CONFIG':
      return { ...state, sortConfig: action.payload };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    case 'SET_IS_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const UserList = () => {
  const [state, dispatch] = useReducer(userListReducer, initialState);
  const { user: authUser, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      dispatch({ type: 'SET_USERS', payload: JSON.parse(storedUsers) });
    } else {
      try {
        const response = await axios.get('https://randomuser.me/api/?results=100');
        const fetchedUsers = response.data.results.map(user => ({
          ...user,
          id: uuidv4(), // Add a unique id to each user
          role: ['Admin', 'Editor', 'Viewer'][Math.floor(Math.random() * 3)]
        }));
        dispatch({ type: 'SET_USERS', payload: fetchedUsers });
        localStorage.setItem('users', JSON.stringify(fetchedUsers));
      } catch (error) {
        console.error('Error fetching users:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch users. Please try again later.' });
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = state.users.filter(user => 
      (user.name.first.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
       user.name.last.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(state.searchTerm.toLowerCase())) &&
      (state.genderFilter === '' || user.gender === state.genderFilter) &&
      (state.roleFilter === '' || user.role === state.roleFilter)
    );

    if (state.sortConfig.key) {
      result.sort((a, b) => {
        if (state.sortConfig.key === 'name') {
          const nameA = `${a.name.first} ${a.name.last}`;
          const nameB = `${b.name.first} ${b.name.last}`;
          return state.sortConfig.direction === 'ascending' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        if (state.sortConfig.key === 'email') {
          return state.sortConfig.direction === 'ascending'
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email);
        }
        return 0;
      });
    }

    return result;
  }, [state.users, state.searchTerm, state.genderFilter, state.roleFilter, state.sortConfig]);

  const currentUsers = useMemo(() => {
    const indexOfLastUser = state.currentPage * state.usersPerPage;
    const indexOfFirstUser = indexOfLastUser - state.usersPerPage;
    return filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [state.currentPage, state.usersPerPage, filteredAndSortedUsers]);

  const paginate = useCallback((pageNumber) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber });
  }, []);

  const handleSort = useCallback((key) => {
    dispatch({ type: 'SET_SORT_CONFIG', payload: {
      key,
      direction: state.sortConfig.key === key && state.sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }});
  }, [state.sortConfig]);

  const handleDelete = useCallback((id) => {
    if (authUser.role !== 'Admin') {
      alert('Only Admins can delete users');
      return;
    }
    const updatedUsers = state.users.filter(user => user.id !== id);
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }, [authUser.role, state.users]);

  const handleUserClick = useCallback((user) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: true });
  }, []);

  const handleSaveUser = useCallback((updatedUser) => {
    console.log('Saving updated user:', updatedUser);
    if (authUser.role !== 'Admin' && authUser.role !== 'Editor') {
      alert('Only Admins and Editors can edit users');
      return;
    }
    const updatedUsers = state.users.map(user => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    );
    console.log('Updated users:', updatedUsers);
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false });
  }, [authUser.role, state.users]);

  const handleAddUser = useCallback((newUser) => {
    console.log('Adding new user:', newUser);
    if (authUser.role !== 'Admin') {
      alert('Only Admins can add users');
      return;
    }
    const userWithId = { ...newUser, id: uuidv4() };
    const updatedUsers = [...state.users, userWithId];
    dispatch({ type: 'SET_USERS', payload: updatedUsers });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false });
  }, [authUser.role, state.users]);

  return (
    <div className={`container mx-auto p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <div className="flex items-center">
          <span className="mr-4">Logged in as: {authUser.role}</span>
          <button
            onClick={toggleTheme}
            className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-600"
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {state.error}</span>
        </div>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search users..."
          value={state.searchTerm}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
          className="p-2 border rounded"
        />
        <select
          value={state.genderFilter}
          onChange={(e) => dispatch({ type: 'SET_GENDER_FILTER', payload: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={state.roleFilter}
          onChange={(e) => dispatch({ type: 'SET_ROLE_FILTER', payload: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        <select
          value={state.usersPerPage}
          onChange={(e) => dispatch({ type: 'SET_USERS_PER_PAGE', payload: Number(e.target.value) })}
          className="p-2 border rounded"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        {authUser.role === 'Admin' && (
          <button
            onClick={() => handleUserClick(null)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          >
            <Plus className="mr-2" /> Add User
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">
                <button onClick={() => handleSort('name')}>Name</button>
              </th>
              <th className="border p-2">
                <button onClick={() => handleSort('email')}>Email</button>
              </th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="border p-2">{`${user.name.first} ${user.name.last}`}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.gender}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <button 
                    onClick={() => handleUserClick(user)}
                    className="mr-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  {authUser.role === 'Admin' && (
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredAndSortedUsers.length / state.usersPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${state.currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <UserDetailsModal
        isOpen={state.isModalOpen}
        onClose={() => dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false })}
        user={state.selectedUser}
        onSave={handleSaveUser}
        onAdd={handleAddUser}
        isAdmin={authUser.role === 'Admin'}
        isEditor={authUser.role === 'Editor'}
      />
    </div>
  );
};

export default React.memo(UserList);