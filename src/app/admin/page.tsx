'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { getAllUsers, deleteUser } from '@/lib/actions';
import {
    Users,
    Shield,
    Trash2,
    Search,
    UserX,
    Clock,
    Zap,
    Calendar,
    AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'ADMIN') {
                router.push('/dashboard');
            }
        }
    }, [user, isLoading, router]);

    const fetchUsers = async () => {
        setFetchLoading(true);
        const data = await getAllUsers();
        setUsersList(data);
        setFetchLoading(false);
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [user]);

    const handleDelete = async (userId: string) => {
        if (confirm('Are you absolutely sure you want to delete this user? This action cannot be undone.')) {
            setIsDeleting(userId);
            const result = await deleteUser(userId);
            if (result.success) {
                setUsersList(usersList.filter(u => u.id !== userId));
            } else {
                alert(result.error);
            }
            setIsDeleting(null);
        }
    };

    if (isLoading || !user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="text-4xl animate-pulse">🔒</div>
            </div>
        );
    }

    const filteredUsers = usersList.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />

            <main className="pt-24 pb-10 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-primary" size={32} />
                            <h1 className="text-3xl font-bold">Admin Command Center</h1>
                        </div>
                        <p className="text-foreground-muted">Monitor and manage the VibeCoding community</p>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-game pl-10 md:w-64"
                        />
                    </motion.div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card p-4">
                        <div className="text-foreground-muted text-sm mb-1 uppercase tracking-wider">Total Users</div>
                        <div className="text-2xl font-bold">{usersList.length}</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-foreground-muted text-sm mb-1 uppercase tracking-wider">Active Today</div>
                        <div className="text-2xl font-bold">
                            {usersList.filter(u => {
                                const lastActive = u.lastActiveAt ? new Date(u.lastActiveAt) : new Date();
                                return (new Date().getTime() - lastActive.getTime()) < 24 * 60 * 60 * 1000;
                            }).length}
                        </div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-foreground-muted text-sm mb-1 uppercase tracking-wider">Avg. Level</div>
                        <div className="text-2xl font-bold">
                            {usersList.length > 0 ? (usersList.reduce((acc, u) => acc + u.level, 0) / usersList.length).toFixed(1) : 0}
                        </div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-foreground-muted text-sm mb-1 uppercase tracking-wider">Total XP</div>
                        <div className="text-2xl font-bold text-xp">
                            {usersList.reduce((acc, u) => acc + u.xp, 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-light/50 border-b border-surface-light">
                                <tr>
                                    <th className="p-4 font-bold text-sm">User</th>
                                    <th className="p-4 font-bold text-sm">Stats</th>
                                    <th className="p-4 font-bold text-sm">Joined</th>
                                    <th className="p-4 font-bold text-sm">Role</th>
                                    <th className="p-4 font-bold text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-light">
                                <AnimatePresence mode='popLayout'>
                                    {fetchLoading ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <div className="animate-spin text-primary mx-auto mb-4" style={{ width: 40, height: 40 }}>
                                                    <Zap size={40} />
                                                </div>
                                                <p className="text-foreground-muted">Querying database...</p>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <UserX className="mx-auto mb-4 text-foreground-muted" size={48} />
                                                <p className="text-foreground-muted">No users found matching your search.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <motion.tr
                                                key={u.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="hover:bg-surface-light/30 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{u.image || '🦊'}</span>
                                                        <div>
                                                            <div className="font-bold flex items-center gap-2">
                                                                {u.name}
                                                                {u.role === 'ADMIN' && <Shield size={14} className="text-primary" />}
                                                            </div>
                                                            <div className="text-xs text-foreground-muted">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Zap size={12} className="text-xp" />
                                                            <span>{u.xp} XP</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Clock size={12} className="text-secondary" />
                                                            <span>Lvl {u.level}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-foreground-muted">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        {new Date(u.joinedAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-surface-light text-foreground-muted'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        disabled={u.id === user.id || isDeleting === u.id}
                                                        className={`p-2 rounded-lg transition-colors ${u.id === user.id
                                                                ? 'opacity-20 cursor-not-allowed text-foreground-muted'
                                                                : 'text-danger hover:bg-danger/10'
                                                            }`}
                                                        title={u.id === user.id ? "You cannot delete yourself" : "Delete User"}
                                                    >
                                                        {isDeleting === u.id ? (
                                                            <div className="animate-spin w-5 h-5 border-2 border-danger border-t-transparent rounded-full" />
                                                        ) : (
                                                            <Trash2 size={20} />
                                                        )}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Database Warning */}
                <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl flex gap-3">
                    <AlertTriangle className="text-warning shrink-0" size={24} />
                    <div className="text-sm">
                        <p className="font-bold text-warning mb-1">Administrative Warning</p>
                        <p className="text-foreground-muted">
                            Deleting a user will permanently remove all their challenge progress, achievements, and statistics.
                            This action is immediate and cannot be reversed by the user.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
