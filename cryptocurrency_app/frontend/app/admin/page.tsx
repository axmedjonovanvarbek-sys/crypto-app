"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const { user, token, isAdmin, loading: authLoading, updateUser } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const isUz = language === 'uz';

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/');
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (!token || !isAdmin) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('https://crypto-app-mn9g.onrender.com/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load users');
        }

        setUsers(data);
      } catch (err: any) {
        setError(err.message || (isUz ? 'Foydalanuvchilarni yuklashda xatolik' : 'Could not load users'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, isUz, token]);

  const stats = useMemo(() => {
    const admins = users.filter((item) => item.role === 'admin').length;
    return {
      admins,
      users: users.length - admins,
      total: users.length,
    };
  }, [users]);

  const handleRoleChange = async (targetUser: AdminUser, role: UserRole) => {
    if (!token || targetUser.role === role) return;

    setUpdatingUserId(targetUser._id);
    setError('');

    try {
      const res = await fetch(`https://crypto-app-mn9g.onrender.com/api/admin/users/${targetUser._id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update role');
      }

      setUsers((currentUsers) =>
        currentUsers.map((item) => (item._id === data._id ? { ...item, role: data.role } : item))
      );

      if (data._id === user?._id) {
        updateUser({ role: data.role });
      }
    } catch (err: any) {
      setError(err.message || (isUz ? 'Rolni yangilashda xatolik' : 'Could not update role'));
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-text">{isUz ? 'Admin Paneli' : 'Admin Panel'}</h1>
        <p className="text-muted mt-2">{isUz ? 'Foydalanuvchilari boshqarish' : 'Manage users and roles'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border border-border/50">
          <p className="text-sm text-muted mb-2">{isUz ? 'Jami foydalanuvchilar' : 'Total Users'}</p>
          <p className="text-3xl font-bold text-text">{stats.total}</p>
        </div>
        <div className="glass-panel p-6 border border-border/50">
          <p className="text-sm text-muted mb-2">{isUz ? 'Adminlar' : 'Admins'}</p>
          <p className="text-3xl font-bold text-primary">{stats.admins}</p>
        </div>
        <div className="glass-panel p-6 border border-border/50">
          <p className="text-sm text-muted mb-2">{isUz ? 'Oddiy foydalanuvchilar' : 'Regular Users'}</p>
          <p className="text-3xl font-bold text-blue-400">{stats.users}</p>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="glass-panel border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted">{isUz ? 'Nom' : 'Name'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted">{isUz ? 'Email' : 'Email'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted">{isUz ? 'Roll' : 'Role'}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted">{isUz ? 'Amallar' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-border/30 hover:bg-surface/30 transition-colors">
                  <td className="px-6 py-4 text-text font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-text text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-text text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? (isUz ? 'Admin' : 'Admin') : (isUz ? 'Foydalanuvchi' : 'User')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                      disabled={updatingUserId === user._id}
                      className="px-3 py-1 bg-surface border border-border rounded-lg text-text text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="user">{isUz ? 'Foydalanuvchi' : 'User'}</option>
                      <option value="admin">{isUz ? 'Admin' : 'Admin'}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
