import { useAdminStore } from "@/app/store/useAdminStore";
import { all } from "axios";
import { useEffect, useState } from "react";
import CrudViewuser from "./CrudView";


const UsersView = () =>{

const {allUsers,fetchAllUsers}=useAdminStore();
const [users,setallusers]=useState([])

useEffect(()=>{
   async function fetchData(){
    await fetchAllUsers();
   }
   fetchData();

},[])
const handledelete=(item)=>{
    setisDeleting(p=>!p)
    setdeletedid(item.id);
}




const handleEdit=(SelectedUser)=>{
setisEditing(p=>!p)
setuser(SelectedUser);
}


const coloumns=[{key: 'username', label: 'Name'},{key: 'email', label: 'Email'}, {key: 'role', label: 'Role'}, {key: 'createdAt', label: 'Joined'}];




    return (
     <CrudViewuser title="Manage Users" data={allUsers} columns={coloumns} onAddItem={() => alert('Add new user')} handletask={handledelete} handleEdit={handleEdit} />
    )
}

export default UsersView;