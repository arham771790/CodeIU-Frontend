import React from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";

export const TagsSection = ({ register, tagFields, appendTag, removeTag, errors }) => {
    return (
        <div className="card bg-base-200 p-4 md:p-6 shadow-md border border-white/10 rounded-md p-6">
            <div className="flex items-center justify-between mb-4 ">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Tags
                </h3>
                <button
                    type="button"
                    className="flex items-center btn btn-primary btn-sm border border-white hover:bg-[#4085F1] hover:text-white rounded-md px-4 py-2 gap-2 cursor-pointer"
                    onClick={() => appendTag("")}
                >
                    <Plus className="w-5 h-5 mr-1" /> Add Tag
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center border border-white/10 rounded-md p-2 bg-gray-800">
                        <input
                            type="text"
                            className="input input-bordered flex-1 bg-gray-800 text-white"
                            {...register(`tags.${index}`)}
                            placeholder="Enter tag"
                        />
                        <button
                            type="button"
                            className="flex btn btn-ghost btn-square btn-sm "
                            onClick={() => removeTag(index)}
                            disabled={tagFields.length === 0}
                        >
                            <Trash2 className="w-4 h-4 text-error hover:text-red-600" />
                        </button>
                    </div>
                ))}
            </div>
            {errors.tags && (
                <div className="mt-2">
                    <span className="text-error text-sm">{errors.tags.message}</span>
                </div>
            )}
        </div>
    );
};
