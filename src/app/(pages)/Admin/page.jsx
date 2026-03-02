"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart2, Table, FileText, Calendar, Map, Puzzle, Settings, Search, Bell, Mail, User, Plus, Users, ShoppingCart, CalendarDays, DollarSign, ArrowUp, ArrowDown, Trophy, Pencil, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '@/store/useAuthStore';
import SidebarLink from './components/SidebarLink';
import UsersView from './components/Userview';
import CrudView from './components/CrudView';
import ProblemsView from './components/ProblemsView';
import ContestView from './components/ContestView';


// Hardcoded icons and styles for cards
const STAT_CONFIG = {
    members: { name: 'Total Members', icon: Users, color: 'from-purple-500 to-indigo-500' },
    submissions: { name: 'Submissions Today', icon: BarChart2, color: 'from-teal-500 to-cyan-500' },
    contests: { name: 'Active Contests', icon: Trophy, color: 'from-pink-500 to-red-500' },
    accepted: { name: 'Accepted Submissions', icon: DollarSign, color: 'from-green-500 to-lime-500' },
};

const recentReportsData = [
    { name: 'Jan', Products: 40, Services: 24 }, { name: 'Feb', Products: 30, Services: 13 },
    { name: 'Mar', Products: 20, Services: 98 }, { name: 'Apr', Products: 27, Services: 39 },
    { name: 'May', Products: 18, Services: 48 }, { name: 'Jun', Products: 23, Services: 38 },
];
const charByPercentData = [{ name: 'Products', value: 400 }, { name: 'Services', value: 300 }];
const COLORS = ['#0088FE', '#00C49F'];


const DashboardView = ({ stats }) => (
    <div className="space-y-8 ">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Overview</h2>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(item => (
                <div key={item.name} className={`bg-gradient-to-br ${item.color} p-6 rounded-xl text-white shadow-lg`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-2xl font-bold">{item.value}</h4>
                            <p className="text-white/80">{item.name}</p>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full"><item.icon className="w-6 h-6" /></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Recent Reports</h3>
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Products</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"></div><span>Services</span></div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="flex items-center gap-1 text-green-400"><ArrowUp className="w-4 h-4" /> 25% Products</span>
                        <span className="flex items-center gap-1 text-red-400"><ArrowDown className="w-4 h-4" /> 10% Services</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}><AreaChart data={recentReportsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="name" stroke="#6b7280" /><YAxis stroke="#6b7280" /><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} /><Area type="monotone" dataKey="Products" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} /><Area type="monotone" dataKey="Services" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} /></AreaChart></ResponsiveContainer>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Char By %</h3>
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Products</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"></div><span>Services</span></div>
                </div>
                <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={charByPercentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">{charByPercentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} /></PieChart></ResponsiveContainer>
            </div>
        </div>
    </div>
);






const GenericView = ({ title }) => (<div><h2 className="text-2xl font-bold text-white">{title}</h2><p className="text-gray-400 mt-2">Content for {title} will be displayed here.</p></div>);

import { axiosInstanceSubmissionService } from '@/lib/axios';
import { useAdminStore } from '@/store/useAdminStore';
import { useContestStore } from '@/store/useContestStore';

// --- Admin Panel Component --
const AdminPage = () => {
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
                        { ...STAT_CONFIG.submissions, value: data.submissionsToday },
                        { ...STAT_CONFIG.contests, value: contests?.length || 0 },
                        { ...STAT_CONFIG.accepted, value: data.acceptedSubmissions },
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
    }, [activeView, allUsers?.length, contests?.length]);

    // if(authUser?.role !== "ADMIN"){
    //     return(
    //         <div>
    //             <div className="flex items-center justify-center h-screen  font-bold text-4xl " >
    //                 <p>404 Page Not Found 😔</p>
    //             </div>
    //         </div>
    //     )
    // }
    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <DashboardView stats={overviewData} />;
            case 'Users': return <UsersView />;
            case 'Problems': return <ProblemsView />;
            case 'Contests': return <ContestView />;
            case 'Submissions': return <GenericView title="Submissions" />;
            case 'Settings': return <GenericView title="Settings" />;
            default: return <DashboardView />;
        }
    };
    const navLinks = ['Dashboard', 'Users', 'Problems', 'Contests', 'Submissions', 'Settings'];
    const navIcons = { 'Dashboard': LayoutDashboard, 'Users': Users, 'Problems': Puzzle, 'Contests': Trophy, 'Submissions': BarChart2, 'Settings': Settings };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans flex">
            <aside className="w-64 bg-black p-6 flex-shrink-0">
                <div className="flex items-center mb-10">
                    <div className="w-10 h-10 bg-teal-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">🌊</div>
                    <h1 className="text-2xl font-bold text-blue-400 ml-3">Code<span className="font-bold text-white">IU</span></h1>
                </div>
                <nav><ul>{navLinks.map(link => (<SidebarLink key={link} icon={navIcons[link]} text={link} active={activeView === link} onClick={() => setActiveView(link)} />))}</ul></nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="bg-gray-900 shadow-md p-4 flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-800" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-400 hover:text-white"><Mail className="w-6 h-6" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full">2</span></button>
                        <button className="relative text-gray-400 hover:text-white"><Bell className="w-6 h-6" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full">3</span></button>
                        <div className="flex items-center gap-3"><img src="https://placehold.co/40x40/1f2937/ffffff?text=AD" alt="John Doe" className="w-10 h-10 rounded-full" /><div><p className="text-white font-semibold">ADMIN</p></div></div>
                    </div>
                </header>
                <main className="flex-1 p-8 bg-gray-800/50 overflow-y-auto">{renderContent()}</main>
            </div>
        </div>
    );
};

export default AdminPage;

