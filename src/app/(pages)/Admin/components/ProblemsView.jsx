'use client'
import { useProblemStore } from "@/app/store/useProblemStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { default: CrudView } = require("./CrudView");

const ProblemsView = () =>{
    const coloumns=[{key: 'title', label: 'Title'}, {key: 'difficulty', label: 'Difficulty', render: (item) => <span className={`${item.difficulty === 'Easy' ? 'text-green-400' : item.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{item.difficulty}</span>}, 
        {key: 'tags', label: 'Tags', render: (item) => item.tags.join(', ')}];
        const mockProblems = [
    { id: 'prob_1', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
    { id: 'prob_2', title: 'Add Two Numbers', difficulty: 'Medium', tags: ['Linked List', 'Math'] },
    { id: 'prob_3', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search'] },
    { id: 'prob_4', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'] },
];


const navigate=useRouter();
const {getAllProblems, problems}=useProblemStore();
useEffect(()=>{
async () => {
    await getAllProblems();
}
},[])


    const handleEditProblem=(item)=>{
    if(item.id){
        navigate.push(`/EditProblem/${item.id}`);
    }
    }

    const deleteproblem=(item)=>{
      alert('problem deleted')
    }
    return(

        <div className="flex flex-col">
                <div className="flex w-full justify-end">
                    <button className="flex items-center  bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    onClick={()=>navigate.push('/CreateProblem')}
                    >
                            <Plus className="w-5 h-5 mr-3" />
                            Add Problems
                        </button>
                </div>
                           <CrudView title="Manage Problems" data={problems.length>0?problems:mockProblems} 
         columns={coloumns} onAddItem={() => alert('Add new problem')} handleEdit={handleEditProblem} handletask={deleteproblem} />
        </div>
      
    )
}

export default ProblemsView