'use client'
import SkeletonUI from "@/components/atoms/Loader";
import { useProblemStore } from "@/store/useProblemStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminCrudView from "./AdminCrudView";
import AdminAddToPlaylistDialog from "./AdminAddToPlaylistDialog";
import { Layers } from "lucide-react";

const AdminProblemsView = () => {
    const navigate = useRouter();
    const { getAllProblems, problems, deleteProblem } = useProblemStore();

    const [isEditing, setisEditing] = useState(false);
    const [isDeleting, setisDeleting] = useState(false)
    const [deletedid, setdeletedid] = useState(null)
    const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    useEffect(() => {
        getAllProblems();
    }, [])

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'difficulty', label: 'Difficulty', render: (item) => (
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${item.difficulty === 'Easy' ? 'bg-success/10 text-success border-success/20' : item.difficulty === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-error/10 text-error border-error/20'}`}>
                    {item.difficulty}
                </span>
            )
        },
        {
            key: 'tags', label: 'Tags', render: (item) => (
                <div className="flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-base-content/5 text-base-content/40 text-[9px] font-black uppercase tracking-tighter rounded-md border border-base-content/5">
                            {tag}
                        </span>
                    ))}
                    {item.tags.length > 3 && <span className="text-[9px] font-black text-base-content/20 ml-1">+{item.tags.length - 3}</span>}
                </div>
            )
        }
    ];

    if (!problems || problems.length === 0) {
        return <SkeletonUI />
    }

    const handleEditProblem = (item) => {
        if (item.id) navigate.push(`/problems/edit-problem/${item.id}`);
    }

    const deleteproblem = (item) => {
        setdeletedid(item.id)
        setisDeleting(true)
    }

    const AddProblem = () => {
        navigate.push('/problems/create-problem')
    }

    const handleAddToPlaylist = (problem) => {
        setSelectedProblem(problem);
        setIsAddToPlaylistOpen(true);
    };

    const renderExtraActions = (item) => (
        <button
            onClick={() => handleAddToPlaylist(item)}
            className="btn btn-square btn-ghost btn-sm rounded-xl text-secondary hover:bg-secondary/10"
            title="Add to Playlist"
        >
            <Layers className="w-4 h-4" />
        </button>
    );

    return (
        <>
            <AdminCrudView
                title="Problem Bank"
                data={problems}
                columns={columns}
                handleEdit={handleEditProblem}
                handledelete={deleteproblem}
                onAddItem={AddProblem}
                isDeleting={isDeleting}
                setisDeleting={setisDeleting}
                isEditing={isEditing}
                setisEditing={setisEditing}
                deletedid={deletedid}
                onDeleteConfirm={deleteProblem}
                renderExtraActions={renderExtraActions}
            />

            <AdminAddToPlaylistDialog
                isOpen={isAddToPlaylistOpen}
                onClose={() => setIsAddToPlaylistOpen(false)}
                problem={selectedProblem}
            />
        </>
    )
}

export default AdminProblemsView;
