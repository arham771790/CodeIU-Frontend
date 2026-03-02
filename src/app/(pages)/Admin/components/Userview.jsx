import { useAdminStore } from "@/store/useAdminStore";
import { all } from "axios";
import { useEffect, useState } from "react";
import CrudViewuser from "./CrudView";
import SkeletonUI from "@/components/atoms/Loader"

const UsersView = () => {

    const { allUsers, fetchAllUsers } = useAdminStore();
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
        async function fetchData() {
            await fetchAllUsers();
        }
        fetchData();

    }, [])







    const coloumns = [{ key: 'username', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'createdAt', label: 'Joined' }];

    if (allUsers?.length == 0) {
        return <SkeletonUI />
    }


    return (
        <CrudViewuser user={user} title="Manage Users" data={allUsers} columns={coloumns} onAddItem={() => alert('Adding user soon')} handleEdit={handleEdit} handledelete={handledelete}
            isDeleting={isDeleting} setisDeleting={setisDeleting} isEditing={isEditing} setisEditing={setisEditing}
            deletedid={deletedid} onDeleteConfirm={DeleteUser}
        />
    )
}

export default UsersView;