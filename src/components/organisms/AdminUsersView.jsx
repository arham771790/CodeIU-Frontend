import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";
import AdminCrudView from "./AdminCrudView";
import SkeletonUI from "@/components/atoms/Loader"

const AdminUsersView = () => {
    const { allUsers, fetchAllUsers, DeleteUser } = useAdminStore();
    const [isEditing, setisEditing] = useState(false);
    const [isDeleting, setisDeleting] = useState(false)
    const [deletedid, setdeletedid] = useState(null)
    const [user, setuser] = useState(null);

    const handleEdit = (SelectedUser) => {
        setisEditing(p => !p)
        setuser(SelectedUser);
    }
    const handledelete = (item) => {
        setisDeleting(p => !p)
        setdeletedid(item.id);
    }

    useEffect(() => {
        fetchAllUsers();
    }, [])

    const columns = [
        { key: 'username', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'role', label: 'Role', render: (item) => (
                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${item.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                    {item.role}
                </span>
            )
        },
        {
            key: 'createdAt', label: 'Joined', render: (item) => (
                <span className="text-base-content/40 font-bold uppercase tracking-tighter text-[10px]">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
            )
        }
    ];

    if (!allUsers || allUsers.length === 0) {
        return <SkeletonUI />
    }

    return (
        <AdminCrudView
            user={user}
            title="User Management"
            data={allUsers}
            columns={columns}
            onAddItem={() => alert('Add User functionality coming soon')}
            handleEdit={handleEdit}
            handledelete={handledelete}
            isDeleting={isDeleting}
            setisDeleting={setisDeleting}
            isEditing={isEditing}
            setisEditing={setisEditing}
            deletedid={deletedid}
            onDeleteConfirm={DeleteUser}
        />
    )
}

export default AdminUsersView;
