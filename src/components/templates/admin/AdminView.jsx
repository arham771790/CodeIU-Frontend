"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Puzzle, Trophy, Search, Bell, Mail, Users, Home } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { axiosInstanceSubmissionService } from '@/lib/axios';
import { useAdminStore } from '@/store/useAdminStore';
import { useContestStore } from '@/store/useContestStore';
import SidebarLink from '@/components/atoms/SidebarLink';

// Atomic Components
import dynamic from 'next/dynamic';

const AdminDashboardView = dynamic(() => import('@/components/organisms/AdminDashboardView'), {
    loading: () => <div className="h-64 bg-base-200 animate-pulse rounded-2xl" />
});
const AdminUsersView = dynamic(() => import('@/components/organisms/AdminUsersView'), {
    loading: () => <div className="h-96 bg-base-200 animate-pulse rounded-2xl" />
});
const AdminProblemsView = dynamic(() => import('@/components/organisms/AdminProblemsView'), {
    loading: () => <div className="h-96 bg-base-200 animate-pulse rounded-2xl" />
});
const AdminContestView = dynamic(() => import('@/components/organisms/AdminContestView'), {
    loading: () => <div className="h-96 bg-base-200 animate-pulse rounded-2xl" />
});

// Stat Config for Dashboard
const STAT_CONFIG = {
    members: { name: 'Total Members', icon: Users, color: 'from-purple-500 to-indigo-500' },
    submissions: { name: 'Submissions Today', icon: LayoutDashboard, color: 'from-teal-500 to-cyan-500' },
    contests: { name: 'Active Contests', icon: Trophy, color: 'from-pink-500 to-red-500' },
    accepted: { name: 'Accepted Submissions', icon: Puzzle, color: 'from-emerald-500 to-teal-500' },
};

const AdminView = () => {
    const [activeView, setActiveView] = useState('Dashboard');
    const { authUser } = useAuthStore();
    const { allUsers, fetchAllUsers } = useAdminStore();
    const { contests, fetchContests } = useContestStore();
    const [overviewData, setOverviewData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [adminRes] = await Promise.all([
                    axiosInstanceSubmissionService.get('/submission/admin/overview'),
                    fetchAllUsers(),
                    fetchContests()
                ]);

                if (adminRes.data.success) {
                    const data = adminRes.data.overview;
                    const stats = [
                        { ...STAT_CONFIG.members, value: allUsers?.length || 0 },
                        { ...STAT_CONFIG.submissions, value: data.submissionsToday || 0 },
                        { ...STAT_CONFIG.contests, value: contests?.length || 0 },
                        { ...STAT_CONFIG.accepted, value: data.acceptedSubmissions || 0 },
                    ];
                    setOverviewData(stats);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (activeView === 'Dashboard') {
            fetchStats();
        }
    }, [activeView, allUsers?.length, contests?.length, fetchAllUsers, fetchContests]);

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <AdminDashboardView stats={overviewData} />;
            case 'Users': return <AdminUsersView />;
            case 'Problems': return <AdminProblemsView />;
            case 'Contests': return <AdminContestView />;
            default: return <AdminDashboardView stats={overviewData} />;
        }
    };

    const navLinks = ['Dashboard', 'Users', 'Problems', 'Contests'];
    const navIcons = {
        'Dashboard': LayoutDashboard,
        'Users': Users,
        'Problems': Puzzle,
        'Contests': Trophy
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content font-sans flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-base-100 border-r border-base-content/5 p-6 flex-shrink-0 flex flex-col">
                <div className="flex items-center mb-10 px-4">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content text-2xl font-bold shadow-lg shadow-primary/20">🌊</div>
                    <h1 className="text-2xl font-black text-primary ml-3 tracking-tighter">Code<span className="text-base-content">IU</span></h1>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        {navLinks.map(link => (
                            <SidebarLink
                                key={link}
                                icon={navIcons[link]}
                                text={link}
                                active={activeView === link}
                                onClick={() => setActiveView(link)}
                            />
                        ))}
                    </ul>
                </nav>

                <div className="pt-6 border-t border-base-content/5">
                    <Link
                        href="/"
                        className="flex items-center p-3 text-base-content/60 hover:bg-base-content/5 hover:text-base-content rounded-xl transition-all duration-200 group"
                    >
                        <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-base-300/30">
                <header className="bg-base-100/50 backdrop-blur-md border-b border-base-content/5 p-4 flex justify-between items-center sticky top-0 z-30">
                    <div className="relative w-full max-w-md ml-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search metrics..."
                            className="w-full bg-base-content/5 border border-base-content/5 rounded-xl pl-10 pr-4 py-2 text-sm text-base-content placeholder:text-base-content/20 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-6 mr-4">
                        <button className="text-base-content/40 hover:text-base-content transition-colors">
                            <Mail className="w-5 h-5" />
                        </button>
                        <button className="text-base-content/40 hover:text-base-content transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-px bg-base-content/10" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs uppercase">
                                {authUser?.username?.slice(0, 2) || 'AD'}
                            </div>
                            <div>
                                <p className="text-base-content text-xs font-black uppercase tracking-widest leading-none">{authUser?.username || 'Administrator'}</p>
                                <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-tighter mt-1">System Root</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminView;
