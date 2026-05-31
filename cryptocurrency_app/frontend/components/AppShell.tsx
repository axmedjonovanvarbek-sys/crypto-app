"use client";

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';

const publicRoutes = ['/login', '/register'];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.replace('/login');
    }

    if (!loading && user && isPublicRoute) {
      router.replace('/');
    }
  }, [isPublicRoute, loading, router, user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isPublicRoute) {
    return <main className="min-h-screen p-6 md:p-8 lg:p-10">{children}</main>;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Navbar />
          <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </SocketProvider>
  );
}
