'use client';

import { useState, useEffect } from 'react';

interface Score {
  id: string;
  gameType: string;
  timeTaken: string;
  createdAt: string;
}

interface UserActivity {
  id: string;
  username: string;
  role: string;
  scores: Score[];
  bestScores: Score[];
  stats: {
    totalGames: number;
    averageTime: number;
    bestTime: number | null;
  };
  _count: {
    scores: number;
    bestScores: number;
  };
}

interface UserManagementModalProps {
  userId: string | null;
  onClose: () => void;
  onDataChange?: () => void;
}

export default function UserManagementModal({ userId, onClose, onDataChange }: UserManagementModalProps) {
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserActivity();
    }
  }, [userId]);

  const fetchUserActivity = async () => {
    if (!userId) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user activity');
      }
      const data = await response.json();
      setUserActivity(data);
    } catch (err) {
      setError('Failed to load user activity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newPassword) return;

    setPasswordLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setMessage(data.message);
      setNewPassword('');
      // Call the data change callback to refresh the admin page
      if (onDataChange) {
        onDataChange();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!userId) return;

    setPasswordLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      setMessage(data.message);
      // Refresh user activity to show updated role
      await fetchUserActivity();
      // Call the data change callback to refresh the admin page
      if (onDataChange) {
        onDataChange();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatTime = (timeInMs: string | number) => {
    const time = typeof timeInMs === 'string' ? parseInt(timeInMs) : timeInMs;
    return (time / 1000).toFixed(2) + 's';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  if (!userId) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">User Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : userActivity ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Username:</span> {userActivity.username}</p>
                    <p><span className="font-medium">Role:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${userActivity.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {userActivity.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p><span className="font-medium">Total Games:</span> {userActivity.stats.totalGames}</p>
                    <p><span className="font-medium">Average Time:</span> {userActivity.stats.averageTime}s</p>
                    <p><span className="font-medium">Best Time:</span> {userActivity.stats.bestTime ? userActivity.stats.bestTime + 's' : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password (min 6 characters)"
                      disabled={passwordLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading || !newPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
                {message && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </div>

              {/* Role Management */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Role Management</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Role:
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${userActivity.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {userActivity.role}
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRoleChange('USER')}
                      disabled={userActivity.role === 'USER' || passwordLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Set as User
                    </button>
                    <button
                      onClick={() => handleRoleChange('ADMIN')}
                      disabled={userActivity.role === 'ADMIN' || passwordLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Set as Admin
                    </button>
                  </div>
                </div>
              </div>

              {/* Game Activity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Game Activity</h3>
                {userActivity.scores.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Game Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time Taken</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userActivity.scores.slice(0, 10).map((score) => (
                          <tr key={score.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{score.gameType}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatTime(score.timeTaken)}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{formatDate(score.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No game activity found.</p>
                )}
              </div>

              {/* Best Scores */}
              {userActivity.bestScores.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Best Scores</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Game Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Best Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Achieved</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userActivity.bestScores.map((score) => (
                          <tr key={score.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{score.gameType}</td>
                            <td className="px-4 py-2 text-sm font-medium text-green-600">{formatTime(score.timeTaken)}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{formatDate(score.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load user data.</p>
              <button
                onClick={fetchUserActivity}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
