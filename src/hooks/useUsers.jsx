import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUsers, addUser as apiAddUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '../services/api'

export const useUsers = () => {
  const queryClient = useQueryClient()
  const [filterState, setFilterState] = useState(() => {
    const storedFilter = sessionStorage.getItem('filterState')
    return storedFilter ? JSON.parse(storedFilter) : {
      search: '',
      gender: '',
      role: '',
      sortBy: '',
      sortOrder: 'asc'
    }
  })

  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    itemsPerPage: 10
  })

  const { data: users = [], isLoading, error } = useQuery(['users'], fetchUsers, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })

  const addUserMutation = useMutation(apiAddUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })

  const updateUserMutation = useMutation(apiUpdateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })

  const deleteUserMutation = useMutation(apiDeleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
  })

  const filteredUsers = useMemo(() => {
    let result = users

    // Apply filters
    if (filterState.search) {
      const searchLower = filterState.search.toLowerCase()
      result = result.filter(user => 
        user.name.first.toLowerCase().includes(searchLower) ||
        user.name.last.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    if (filterState.gender) {
      result = result.filter(user => user.gender === filterState.gender)
    }

    if (filterState.role) {
      result = result.filter(user => user.role === filterState.role)
    }

    // Apply sorting
    if (filterState.sortBy) {
      result.sort((a, b) => {
        let aValue, bValue
        switch (filterState.sortBy) {
          case 'firstName':
            aValue = a.name.first
            bValue = b.name.first
            break
          case 'lastName':
            aValue = a.name.last
            bValue = b.name.last
            break
          case 'email':
            aValue = a.email
            bValue = b.email
            break
          default:
            return 0
        }
        if (aValue < bValue) return filterState.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return filterState.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [users, filterState])

  const paginatedUsers = useMemo(() => {
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + paginationState.itemsPerPage)
  }, [filteredUsers, paginationState])

  useEffect(() => {
    sessionStorage.setItem('filterState', JSON.stringify(filterState))
  }, [filterState])

  return {
    users: paginatedUsers,
    isLoading,
    error,
    addUser: addUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    filterState,
    setFilterState,
    paginationState,
    setPaginationState,
  }
}