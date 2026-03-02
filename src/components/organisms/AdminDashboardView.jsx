import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#14b8a6'];

const AdminDashboardView = ({ stats }) => {
    const recentReportsData = [
        { name: 'Jan', Users: 40, Submissions: 24 }, { name: 'Feb', Users: 30, Submissions: 13 },
        { name: 'Mar', Users: 20, Submissions: 98 }, { name: 'Apr', Users: 27, Submissions: 39 },
        { name: 'May', Users: 18, Submissions: 48 }, { name: 'Jun', Users: 23, Submissions: 38 },
    ];
    const charByPercentData = [{ name: 'Users', value: 400 }, { name: 'Submissions', value: 300 }];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-base-content">
                    System <span className="text-primary">Overview</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(item => (
                    <div key={item.name} className={`bg-gradient-to-br ${item.color} p-6 rounded-3xl text-white shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h4 className="text-4xl font-black mb-1">{item.value}</h4>
                                <p className="text-white/60 text-[10px] uppercase font-black tracking-[0.2em]">{item.name}</p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform">
                                <item.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-base-100 border border-base-content/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50" />
                    <h3 className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.4em] mb-8">Activity Trends</h3>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-[10px] uppercase font-black text-base-content/40 tracking-widest">Users</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary"></div><span className="text-[10px] uppercase font-black text-base-content/40 tracking-widest">Submissions</span></div>
                        <div className="ml-auto">
                            <span className="inline-flex items-center gap-1 bg-success/10 text-success text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"><ArrowUp className="w-3 h-3" /> +25% Growth</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={recentReportsData}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-base-content/20" fontSize={9} fontVariant="black" axisLine={false} tickLine={false} />
                            <YAxis stroke="currentColor" className="text-base-content/20" fontSize={9} fontVariant="black" axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsla(var(--bc) / 0.1)',
                                    borderRadius: '1.5rem',
                                    fontSize: '10px',
                                    fontFamily: 'inherit',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    padding: '12px'
                                }}
                                itemStyle={{ padding: '0px' }}
                            />
                            <Area type="monotone" dataKey="Users" stackId="1" stroke="hsl(var(--p))" fill="url(#colorBlue)" fillOpacity={1} strokeWidth={3} />
                            <Area type="monotone" dataKey="Submissions" stackId="1" stroke="hsl(var(--s))" fill="url(#colorTeal)" fillOpacity={1} strokeWidth={3} />
                            <defs>
                                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--p))" stopOpacity={0.15} /><stop offset="95%" stopColor="hsl(var(--p))" stopOpacity={0} /></linearGradient>
                                <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--s))" stopOpacity={0.15} /><stop offset="95%" stopColor="hsl(var(--s))" stopOpacity={0} /></linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-base-100 border border-base-content/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary/50 to-secondary/50" />
                    <h3 className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.4em] mb-8">System Health</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={charByPercentData}
                                cx="50%" cy="50%"
                                innerRadius={70} outerRadius={90}
                                paddingAngle={8} dataKey="value"
                                stroke="none"
                            >
                                {charByPercentData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--p))' : 'hsl(var(--s))'} />)}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--b1))',
                                    border: '1px solid hsla(var(--bc) / 0.1)',
                                    borderRadius: '1.5rem',
                                    fontSize: '10px',
                                    fontFamily: 'inherit',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    padding: '12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardView;
