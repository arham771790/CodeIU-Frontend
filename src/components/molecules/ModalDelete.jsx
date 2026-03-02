"use client";


import Portal from "@/components/atoms/Portal";
import { useAdminStore } from "@/store/useAdminStore";

const ModalDelete = ({ isDeleting, setisDeleting,userid }) => {
  if (!isDeleting) return null;


 const { DeleteUser}=useAdminStore()
  

  const handledelete=async(e)=>{
    e.preventDefault();
    try {

      await DeleteUser(userid);
      setisEditing(false);
    } catch (error) {
      console.log('Error while Deleting');
      
    }
  }

const onclose=()=>{
    setisDeleting(false);
}
  return (
    <Portal>
         <div className="absolute top-1/2 bg-black left-1/2 -translate-x-1/3 -translate-y-1/2  p-6 rounded-lg shadow-lg w-96">
    <div className="flex flex-col">
    
        <form onSubmit={handledelete} >

            <button type='button' className="p-1 rounded bg-green-400 w-2/3 text-white font-bold" onClick={onclose}>Cancel</button>
            <button type="submit" className="p-1 rounded bg-red-500 w-2/3 text-white font-bold">Delete</button>
        </form>
    </div>
    </div>
    </Portal>
  );
};

export default ModalDelete;
