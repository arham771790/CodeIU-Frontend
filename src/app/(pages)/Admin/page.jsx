"use client";

import React, { useState } from 'react';
import { LayoutDashboard, BarChart2, Table, FileText, Calendar, Map, Puzzle, Settings, Search, Bell, Mail, User, Plus, Users, ShoppingCart, CalendarDays, DollarSign, ArrowUp, ArrowDown, Trophy, Pencil, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '@/app/store/useAuthStore';

// --- Mock Data ---
const overviewData = [
    { name: 'Members Online', value: '10,368', icon: Users, color: 'from-purple-500 to-indigo-500', trend: <LineChart width={100} height={40} data={[{uv: 10}, {uv: 50}, {uv: 30}, {uv: 60}, {uv: 40}]}><Line type="monotone" dataKey="uv" stroke="#fff" strokeWidth={2} dot={false} /></LineChart> },
    { name: 'Submissions Today', value: '3,886', icon: BarChart2, color: 'from-teal-500 to-cyan-500', trend: <LineChart width={100} height={40} data={[{uv: 20}, {uv: 40}, {uv: 10}, {uv: 50}, {uv: 30}]}><Line type="monotone" dataKey="uv" stroke="#fff" strokeWidth={2} dot={false} /></LineChart> },
    { name: 'Active Contests', value: '12', icon: Trophy, color: 'from-pink-500 to-red-500', trend: <LineChart width={100} height={40} data={[{uv: 5}, {uv: 15}, {uv: 10}, {uv: 25}, {uv: 20}]}><Line type="monotone" dataKey="uv" stroke="#fff" strokeWidth={2} dot={false} /></LineChart> },
    { name: 'Total Earnings', value: '$1,060,386', icon: DollarSign, color: 'from-green-500 to-lime-500', trend: <BarChart width={100} height={40} data={[{uv: 10}, {uv: 20}, {uv: 15}, {uv: 25}, {uv: 30}, {uv: 18}]}><Bar dataKey="uv" fill="#fff" /></BarChart> },
];

const recentReportsData = [
    { name: 'Jan', Products: 40, Services: 24 }, { name: 'Feb', Products: 30, Services: 13 },
    { name: 'Mar', Products: 20, Services: 98 }, { name: 'Apr', Products: 27, Services: 39 },
    { name: 'May', Products: 18, Services: 48 }, { name: 'Jun', Products: 23, Services: 38 },
];
const charByPercentData = [ { name: 'Products', value: 400 }, { name: 'Services', value: 300 } ];
const COLORS = ['#0088FE', '#00C49F'];

const mockUsers = [
  { id: 'usr_1', name: 'John Doe', email: 'john@example.com', role: 'Admin', joined: '2024-01-15' },
  { id: 'usr_2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', joined: '2024-02-20' },
  { id: 'usr_3', name: 'Mike Johnson', email: 'mike@example.com', role: 'User', joined: '2024-03-10' },
  { id: 'usr_4', name: 'Emily Davis', email: 'emily@example.com', role: 'Moderator', joined: '2024-04-05' },
];

const mockProblems = [
    { id: 'prob_1', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
    { id: 'prob_2', title: 'Add Two Numbers', difficulty: 'Medium', tags: ['Linked List', 'Math'] },
    { id: 'prob_3', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search'] },
    { id: 'prob_4', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'] },
];

const mockContests = [
    { id: 'cont_1', title: 'Weekly Contest #301', startTime: '2025-10-18 10:00', endTime: '2025-10-18 12:00', status: 'Live' },
    { id: 'cont_2', title: 'Biweekly Contest #98', startTime: '2025-10-25 20:00', endTime: '2025-10-25 22:00', status: 'Upcoming' },
    { id: 'cont_3', title: 'Weekly Contest #300', startTime: '2025-10-11 10:00', endTime: '2025-10-11 12:00', status: 'Finished' },
];

// --- Reusable Components ---
const SidebarLink = ({ icon: Icon, text, active, onClick }) => (
    <li onClick={onClick} className={`flex items-center p-3 cursor-pointer transition-colors rounded-lg ${active ? 'bg-teal-800 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span>{text}</span>
    </li>
);

// --- Main Views ---
const DashboardView = () => (
    <div className="space-y-8 ">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Overview</h2>
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                Add Item
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewData.map(item => (
                <div key={item.name} className={`bg-gradient-to-br ${item.color} p-6 rounded-xl text-white shadow-lg`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-3xl font-bold">{item.value}</p>
                            <p className="text-white/80">{item.name}</p>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full"><item.icon className="w-6 h-6" /></div>
                    </div>
                    <div className="mt-4 opacity-75">{item.trend}</div>
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
                <ResponsiveContainer width="100%" height={300}><AreaChart data={recentReportsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="name" stroke="#6b7280" /><YAxis stroke="#6b7280" /><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/><Area type="monotone" dataKey="Products" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} /><Area type="monotone" dataKey="Services" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} /></AreaChart></ResponsiveContainer>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Char By %</h3>
                 <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Products</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"></div><span>Services</span></div>
                 </div>
                <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={charByPercentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">{charByPercentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/></PieChart></ResponsiveContainer>
            </div>
        </div>
    </div>
);

const CrudView = ({ title, data, columns, onAddItem }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button onClick={onAddItem} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"><Plus className="w-5 h-5 mr-2" />Add New</button>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-900">
                    <tr>{columns.map(col => <th key={col.key} className="p-4 font-semibold">{col.label}</th>)}<th className="p-4 font-semibold">Actions</th></tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            {columns.map(col => <td key={col.key} className="p-4">{col.render ? col.render(item) : item[col.key]}</td>)}
                            <td className="p-4"><div className="flex gap-2"><button className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4"/></button><button className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const UsersView = () => <CrudView title="Manage Users" data={mockUsers} columns={[{key: 'name', label: 'Name'},{key: 'email', label: 'Email'}, {key: 'role', label: 'Role'}, {key: 'joined', label: 'Joined'}]} onAddItem={() => alert('Add new user')} />;
const ProblemsView = () => <CrudView title="Manage Problems" data={mockProblems} columns={[{key: 'title', label: 'Title'}, {key: 'difficulty', label: 'Difficulty', render: (item) => <span className={`${item.difficulty === 'Easy' ? 'text-green-400' : item.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{item.difficulty}</span>}, {key: 'tags', label: 'Tags', render: (item) => item.tags.join(', ')}]} onAddItem={() => alert('Add new problem')} />;
const ContestsView = () => <CrudView title="Manage Contests" data={mockContests} columns={[{key: 'title', label: 'Title'}, {key: 'startTime', label: 'Start Time'}, {key: 'endTime', label: 'End Time'}, {key: 'status', label: 'Status', render: (item) => <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Live' ? 'bg-red-500/50 text-red-300' : item.status === 'Upcoming' ? 'bg-yellow-500/50 text-yellow-300' : 'bg-gray-500/50 text-gray-300'}`}>{item.status}</span>}]} onAddItem={() => alert('Add new contest')} />;
const GenericView = ({ title }) => (<div><h2 className="text-2xl font-bold text-white">{title}</h2><p className="text-gray-400 mt-2">Content for {title} will be displayed here.</p></div>);

// --- Admin Panel Component ---
const AdminPage = () => {
    const [activeView, setActiveView] = useState('Dashboard');
    const {authUser} = useAuthStore();

    if(authUser?.role !== "ADMIN"){
        return(
            <div>
                <div className="flex items-center justify-center h-screen  font-bold text-4xl " >
                    <p>404 Page Not Found 😔</p>
                </div>
            </div>
        )
    }
    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <DashboardView />;
            case 'Users': return <UsersView />;
            case 'Problems': return <ProblemsView />;
            case 'Contests': return <ContestsView />;
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
                <nav><ul>{navLinks.map(link => (<SidebarLink key={link} icon={navIcons[link]} text={link} active={activeView === link} onClick={() => setActiveView(link)}/>))}</ul></nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="bg-gray-900 shadow-md p-4 flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                         <input type="text" placeholder="Search..." className="w-full bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-800"/>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-400 hover:text-white"><Mail className="w-6 h-6"/><span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full">2</span></button>
                        <button className="relative text-gray-400 hover:text-white"><Bell className="w-6 h-6"/><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full">3</span></button>
                        <div className="flex items-center gap-3"><img src="https://placehold.co/40x40/1f2937/ffffff?text=JD" alt="John Doe" className="w-10 h-10 rounded-full"/><div><p className="text-white font-semibold">John Doe</p></div></div>
                    </div>
                </header>
                <main className="flex-1 p-8 bg-gray-800/50 overflow-y-auto">{renderContent()}</main>
            </div>
        </div>
    );
};

export default AdminPage;

