
import Modal from "@/app/components/smallcomponents/ModalUpdate";
import { useAdminStore } from "@/app/store/useAdminStore";
import { Database, Pencil, Plus, Trash2 } from "lucide-react";


const ModalDlt= ({ isDeleting, setisDeleting,userid }) => {
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

         <div className="absolute w-fit top-1/2 bg-black left-1/2  -translate-y-1/2  p-6 rounded-lg shadow-lg ">
    <div className="flex flex-col w-full">
    
        <form onSubmit={handledelete} className="flex flex-col">
             <div className="mb-4 "><span>Are you sure you want to delete this user?</span></div>
            <button type='button' className="rounded bg-green-400 mb-2  p-2 text-white font-bold" onClick={onclose}>NO</button>
            <button type="submit" className=" rounded bg-red-500  p-2 text-white font-bold">YES</button>
        </form>
    </div>
    </div>

  );
};

const CrudView = ({ title, data, columns, onAddItem,handleEdit,handledelete ,isEditing,isDeleting,setisDeleting,setisEditing,deletedid }) => {



    
  return  <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button onClick={onAddItem} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"><Plus className="w-5 h-5 mr-2" />Add New</button>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-900">
                    <tr>{columns.map(col => <th key={col.key} className="p-4 font-semibold">{col.label}</th>)}<th className="p-4 font-semibold">Actions</th></tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            {columns.map(col => <td key={col.key} className="p-4">{col.render ? col.render(item) : item[col.key]}</td>)}
                            <td className="p-4"><div className="flex gap-2"><button className="text-blue-400 hover:text-blue-300"><Pencil className="w-4 h-4" onClick={()=>handleEdit(item)}/></button><button className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 " onClick={()=>handledelete(item)}/></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
     {isEditing&& <Modal isOpen={isEditing} setisEditing={setisEditing} user={data}/>}
     {isDeleting&& <ModalDlt isDeleting={isDeleting} setisDeleting={setisDeleting} userid={deletedid}/>}
    </div>
}

export default CrudView;