'use client'
import SkeletonUI from "@/app/components/smallcomponents/SkeletonUI";
import { useProblemStore } from "@/app/store/useProblemStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { default: CrudView } = require("./CrudView");

const ProblemsView = () =>{
    const coloumns=[{key: 'title', label: 'Title'}, {key: 'difficulty', label: 'Difficulty', render: (item) => <span className={`${item.difficulty === 'Easy' ? 'text-green-400' : item.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{item.difficulty}</span>}, 
        {key: 'tags', label: 'Tags', render: (item) => item.tags.join(', ')}];
//         const mockProblems = [
//     { id: 'prob_1', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
//     { id: 'prob_2', title: 'Add Two Numbers', difficulty: 'Medium', tags: ['Linked List', 'Math'] },
//     { id: 'prob_3', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search'] },
//     { id: 'prob_4', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'] },
// ];



const [isEditing,setisEditing]=useState(false);
const [user,setuser]=useState(null)
const [isDeleting,setisDeleting]=useState(false)
const [deletedid,setdeletedid]=useState(null)

const navigate=useRouter();
const {getAllProblems, problems}=useProblemStore();
useEffect(()=>{
(async () => {
    await getAllProblems();
})()
},[])


if(problems.length===0){
    return <SkeletonUI/>
    
}


    const handleEditProblem=(item)=>{
    if(item.id){
        navigate.push(`/EditProblem/${item.id}`);
    }
    }

    const deleteproblem=(item)=>{
     setdeletedid(item.id)
     setisDeleting(true)
    }

    const AddProblem=()=>{
        navigate.push('/CreateProblem')
    }
    return(

        <div className="flex flex-col">
            
                           <CrudView title="Manage Problems" data={problems.length>0&&problems} 
         columns={coloumns} handleEdit={handleEditProblem} handledelete={deleteproblem} onAddItem={AddProblem}
         isDeleting={isDeleting} setisDeleting={setisDeleting} isEditing={isEditing} setisEditing={setisEditing}
         deletedid={deletedid}
         />
        </div>
      
    )
}

export default ProblemsView