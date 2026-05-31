"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ShieldCheck, Users, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
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
        const res = await fetch('https://crypto-app-d4s5.onrender.com/api/admin/users', {
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
      const res = await fetch(`https://crypto-app-d4s5.onrender.com/api/admin/users/${targetUser._id}/role`, {
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
        <h1 className="mb-2 flex items-center text-3xl font-bold text-text">
          <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
          {isUz ? 'Admin panel' : 'Admin Panel'}
        </h1>
        <p className="text-muted">
          {isUz
            ? 'Ro\'yxatdan o\'tgan foydalanuvchilar va ularning rollarini boshqaring.'
            : 'Manage registered users and their roles.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-medium text-muted">{isUz ? 'Jami foydalanuvchilar' : 'Total Users'}</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text">{stats.total}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-medium text-muted">Admin</p>
            <ShieldCheck className="h-5 w-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-text">{stats.admins}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-medium text-muted">User</p>
            <UserCheck className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-text">{stats.users}</p>
        </motion.div>
      </div>

      {error && (
        <div className="flex items-center rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-danger">
          <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold text-text">
            {isUz ? 'Foydalanuvchilar' : 'Users'}
          </h2>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-panel">
                  <th className="p-4 font-medium text-muted">{isUz ? 'Ism' : 'Name'}</th>
                  <th className="p-4 font-medium text-muted">Email</th>
                  <th className="p-4 font-medium text-muted">{isUz ? 'Rol' : 'Role'}</th>
                  <th className="p-4 font-medium text-muted">{isUz ? 'Ro\'yxatdan o\'tgan' : 'Registered'}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id} className="border-b border-border transition-colors hover:bg-panelHover">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                          {item.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-text">{item.name}</p>
                          {item._id === user?._id && (
                            <p className="text-xs text-muted">{isUz ? 'Siz' : 'You'}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text">{item.email}</td>
                    <td className="p-4">
                      <select
                        value={item.role}
                        disabled={updatingUserId === item._id}
                        onChange={(event) => handleRoleChange(item, event.target.value as UserRole)}
                        className="rounded-xl border border-border bg-panel px-3 py-2 text-sm font-medium text-text outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
