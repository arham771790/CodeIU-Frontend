"use client";

import { useState } from "react";
import Portal from "./Portal";
import { useAdminStore } from "@/app/store/useAdminStore";

const Modal = ({ isOpen, setisEditing,user }) => {
  if (!isOpen) return null;

  const [role, setRole] = useState(user.role);
  const [username, setUsername] = useState(user.username);
 const { UpdateUser}=useAdminStore()
  

  const handleupdate=async(e)=>{
    e.preventDefault();
  
    try {
      const data={
        role,
        username
      }
      await UpdateUser(user.id,data);
      setisEditing(false);
    } catch (error) {
      console.log('Error while Updating');
      
    }
  }

const onclose=()=>{
    setisEditing(false);
}
  return (
    <Portal>
         <div className="absolute top-1/2 bg-black left-1/2 -translate-x-1/3 -translate-y-1/2  p-6 rounded-lg shadow-lg w-96">
    <div className="flex flex-col">
        <h2 className="w-full text-black flex justify-between items-center "><span className="px-3 bg-gray-300 rounded"> Editing User</span><span className="text-sm px-5 py-1 text-center  text-black rounded p-1 bg-white cursor-pointer" onClick={onclose}>❌</span></h2>
        <form onSubmit={handleupdate} >
       <div className="flex flex-col gap-1  justify-center mt-4"> 
        <label className="block mb-2  font-medium text-gray-300">Role:</label>
        <select className="w-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"  value={user?.username??'none'} 
         onChange={(e) => setRole(e.target.value)}>
     
            <option value="">{role}</option>
            {role=='USER'?<option value="ADMIN">ADMIN</option>:<option value="USER">USER</option>}
            
            </select>
            
            </div>
            <div className="flex flex-col gap-2  justify-center mt-4 mb-4"> 
            <label htmlFor="ipt" className="mr-1">Username</label>
            <input id="ipt" type="text" value={username} className="w-full p-1 border-gray-300 rounded-md bg-gray-800 px-2" placeholder="Enter Username..." onChange={(e)=>setUsername(e.target.value)}/>
            </div>

            <button type="submit" className="p-1 rounded bg-green-400 w-2/3 text-white font-bold">Update</button>
        </form>
    </div>
    </div>
    </Portal>
  );
};

export default Modal;
