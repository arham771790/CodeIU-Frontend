import React from "react";

export const BasicInfoSection = ({ register, errors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-white/10 rounded-md p-6">
            <div className="form-control md:col-span-2 border border-white/10 rounded-md p-6">
                <label className="label">
                    <span className="label-text text-base md:text-lg font-semibold">Title</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full text-base md:text-lg"
                    {...register("title")}
                    placeholder="Enter problem title"
                />
                {errors.title && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.title.message}</span>
                    </label>
                )}
            </div>

            <div className="form-control md:col-span-2 border border-white/10 rounded-md p-6">
                <label className="label">
                    <span className="label-text text-base md:text-lg font-semibold">Description</span>
                </label>
                <textarea
                    className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y"
                    {...register("description")}
                    placeholder="Enter problem description"
                />
                {errors.description && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.description.message}</span>
                    </label>
                )}
            </div>

            <div className="form-control border border-white/10 rounded-md p-6">
                <label className="label">
                    <span className="label-text text-base md:text-lg font-semibold">Difficulty</span>
                </label>
                <select
                    className="select select-bordered w-full text-base bg-black md:text-lg"
                    {...register("difficulty")}
                >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.difficulty.message}</span>
                    </label>
                )}
            </div>
        </div>
    );
};
