import React from 'react'

const SidebarLink = ({ icon: Icon, text, active, onClick }) => (
    <li
        onClick={onClick}
        className={`flex items-center p-3 cursor-pointer transition-all duration-200 rounded-xl group ${active
                ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                : 'text-base-content/60 hover:bg-base-content/5 hover:text-base-content'
            }`}
    >
        <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
    </li>
);

export default SidebarLink
