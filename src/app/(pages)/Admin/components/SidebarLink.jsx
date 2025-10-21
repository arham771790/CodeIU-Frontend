import React from 'react'

const SidebarLink = ({ icon: Icon, text, active, onClick }) => (
    <li onClick={onClick} className={`flex items-center p-3 cursor-pointer transition-colors rounded-lg ${active ? 'bg-teal-800 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span>{text}</span>
    </li>
);

export default SidebarLink
