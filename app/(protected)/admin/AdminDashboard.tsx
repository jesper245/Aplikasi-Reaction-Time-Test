'use client';

import { useState } from 'react';
import UserManagementModal from '@/app/components/UserManagementModal';

interface User {
  id: string;
  username: string;
  role: string;
  _count: {
    scores: number;
    bestScores: number;
  };
}

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface Stats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  totalScores: number;
  totalBestScores: number;
  recentActivity: number;
}

interface AdminDashboardProps {
  user: AdminUser;
  users: User[];
  stats: Stats;
}

export default function AdminDashboard({ user, users: initialUsers, stats: initialStats }: AdminDashboardProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [refreshing, setRefreshing] = useState(false);

  const handleUserRowClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  const handleDataChange = async () => {
    setRefreshing(true);
    try {
      // Fetch updated users data
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const updatedUsers = await usersResponse.json();
        setUsers(updatedUsers);

        // Update stats based on new user data
        const updatedStats = {
          ...stats,
          totalUsers: updatedUsers.length,
          adminUsers: updatedUsers.filter((u: User) => u.role === 'ADMIN').length,
          regularUsers: updatedUsers.filter((u: User) => u.role === 'USER').length,
        };
        setStats(updatedStats);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
        <span>Welcome, Admin {user.username}! You have full access to the system.</span>
        {refreshing && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Users:</span>
              <span className="text-2xl font-bold text-blue-600">{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Admin Users:</span>
              <span className="text-lg font-semibold text-purple-600">{stats.adminUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Regular Users:</span>
              <span className="text-lg font-semibold text-green-600">{stats.regularUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Games Played:</span>
              <span className="text-lg font-semibold text-orange-600">{stats.totalScores}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Best Scores Recorded:</span>
              <span className="text-lg font-semibold text-red-600">{stats.totalBestScores}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Games Today:</span>
              <span className="text-lg font-semibold text-indigo-600">{stats.recentActivity}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Instructions:</strong> Click on any user row to open the management modal where you can view their game activity and change their password.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Scores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Best Scores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => handleUserRowClick(u.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {u.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {u._count.scores}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {u._count.bestScores}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {u.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserRowClick(u.id);
                      }}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUserId && (
        <UserManagementModal
          userId={selectedUserId}
          onClose={handleCloseModal}
          onDataChange={handleDataChange}
        />
      )}
    </div>
  );
}
