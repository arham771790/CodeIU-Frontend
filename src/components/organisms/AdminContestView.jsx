'use client'
import CreateContestDialog from '@/components/organisms/CreateContestDialog'
import EditContestDialog from '@/components/organisms/EditContestDialog'
import React, { useEffect, useState } from 'react'
import AdminCrudView from './AdminCrudView'
import { useContestStore } from '@/store/useContestStore'
import SkeletonUI from '@/components/atoms/Loader'

const AdminContestView = () => {
    const { fetchContests, contests, deleteContest } = useContestStore();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [isDeleting, setisDeleting] = useState(false)
    const [deletedid, setdeletedid] = useState(null)

    useEffect(() => {
        fetchContests();
    }, [])

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'startTime', label: 'Schedule Start', render: (item) => (
                <div className="flex flex-col">
                    <span className="text-base-content font-black tracking-tight">{new Date(item.startTime || item.startsAt).toLocaleDateString()}</span>
                    <span className="text-[9px] uppercase font-black text-base-content/40 tracking-widest">{new Date(item.startTime || item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: 'endTime', label: 'Schedule End', render: (item) => (
                <div className="flex flex-col">
                    <span className="text-base-content/60 font-black tracking-tight">{new Date(item.endTime || item.endsAt).toLocaleDateString()}</span>
                    <span className="text-[9px] uppercase font-black text-base-content/20 tracking-widest">{new Date(item.endTime || item.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: 'status', label: 'Status', render: (item) => (
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${item.status === 'RUNNING' || item.status === 'Live' ? 'bg-error/10 text-error border-error/20 animate-pulse' : item.status === 'UPCOMING' || item.status === 'Upcoming' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-base-content/10 text-base-content/40 border-base-content/10'}`}>
                    {item.status}
                </span>
            )
        }
    ];

    if (!contests || contests.length === 0) {
        return <SkeletonUI />
    }

    const handledelete = (item) => {
        setisDeleting(true)
        setdeletedid(item.id);
    }

    return (
        <div>
            <AdminCrudView
                title="Contest Management"
                data={contests}
                columns={columns}
                onAddItem={() => setOpen(true)}
                handleEdit={(item) => setEditing(item)}
                handledelete={handledelete}
                isDeleting={isDeleting}
                setisDeleting={setisDeleting}
                deletedid={deletedid}
                onDeleteConfirm={deleteContest}
            />
            {open && <CreateContestDialog setOpen={setOpen} />}
            {editing && <EditContestDialog contest={editing} onClose={() => setEditing(null)} />}
        </div>
    )
}

export default AdminContestView;
