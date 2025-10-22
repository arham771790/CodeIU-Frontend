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







const coloumns=[{key: 'username', label: 'Name'},{key: 'email', label: 'Email'}, {key: 'role', label: 'Role'}, {key: 'createdAt', label: 'Joined'}];




    return (
     <CrudViewuser title="Manage Users" data={allUsers} columns={coloumns} onAddItem={() => alert('Add new user')} />
    )
}

export default UsersView;