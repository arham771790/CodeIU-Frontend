import Modal from "@/components/molecules/ModalUpdate";
import { Pencil, Plus, Trash2 } from "lucide-react";

const ModalDlt = ({ isDeleting, setisDeleting, id, onDelete }) => {
    if (!isDeleting) return null;

    const handledelete = async (e) => {
        e.preventDefault();
        try {
            await onDelete(id);
            setisDeleting(false);
        } catch (error) {
            console.error('Error while Deleting:', error);
        }
    }

    const onclose = () => {
        setisDeleting(false);
    }
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-base-100 border border-base-content/10 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl transform animate-in fade-in zoom-in duration-200">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-base-content">Confirm Deletion</h3>
                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest leading-relaxed">
                        Are you sure you want to permanently delete this item? This action cannot be undone.
                    </p>
                    <div className="flex flex-col gap-3 pt-6">
                        <button
                            onClick={handledelete}
                            className="btn btn-error btn-md rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            Delete Permanently
                        </button>
                        <button
                            onClick={onclose}
                            className="btn btn-ghost btn-md rounded-xl font-black uppercase tracking-widest text-[10px] text-base-content/40 hover:text-base-content"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminCrudView = ({ title, data, columns, onAddItem, handleEdit, handledelete, onDeleteConfirm, isEditing, isDeleting, setisDeleting, setisEditing, deletedid, renderExtraActions }) => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-base-content">
                    {title.split(' ')[0]} <span className="text-primary">{title.split(' ').slice(1).join(' ')}</span>
                </h2>
                <button
                    onClick={onAddItem}
                    className="btn btn-primary rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 group"
                >
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Add New Entry
                </button>
            </div>

            <div className="bg-base-100 border border-base-content/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-base-content/[0.02]">
                                {columns.map(col => (
                                    <th key={col.key} className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/30 border-b border-base-content/5">
                                        {col.label}
                                    </th>
                                ))}
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/30 border-b border-base-content/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-content/5">
                            {data && data.length > 0 ? data.map(item => (
                                <tr key={item.id || item._id} className="hover:bg-base-content/[0.02] transition-colors group">
                                    {columns.map(col => (
                                        <td key={col.key} className="p-6 text-xs font-bold text-base-content/70">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    <td className="p-6">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {renderExtraActions && renderExtraActions(item)}
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="btn btn-square btn-ghost btn-sm rounded-xl text-primary hover:bg-primary/10"
                                                title="Edit Entry"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handledelete(item)}
                                                className="btn btn-square btn-ghost btn-sm rounded-xl text-error hover:bg-error/10"
                                                title="Delete Entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                                            <div className="w-16 h-16 border-4 border-dashed border-current rounded-full animate-spin" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting System Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditing && <Modal isOpen={isEditing} setisEditing={setisEditing} user={data} />}
            {isDeleting && (
                <div className="relative">
                    <ModalDlt isDeleting={isDeleting} setisDeleting={setisDeleting} id={deletedid} onDelete={onDeleteConfirm} />
                </div>
            )}
        </div>
    );
}

export default AdminCrudView;
