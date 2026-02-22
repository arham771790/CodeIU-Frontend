import React from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

export const TestCasesSection = ({ register, testCaseFields, appendTestCase, removeTestCase, errors }) => {
    return (
        <div className="card bg-base-200 p-4 md:p-6 shadow-md border border-white/10 rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Test Cases
                </h3>
                <button
                    type="button"
                    className="flex items-center btn btn-primary btn-sm border border-white hover:bg-[#4085F1] hover:text-white rounded-md px-4 py-2 gap-2 cursor-pointer"
                    onClick={() => appendTestCase({ input: "", output: "" })}
                >
                    <Plus className="w-5 h-5 mr-1" /> Add Test Case
                </button>
            </div>
            <div className="space-y-6">
                {testCaseFields.map((field, index) => (
                    <div key={field.id} className="card bg-base-100 shadow-md">
                        <div className="card-body p-4 md:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base md:text-lg font-semibold">Test Case #{index + 1}</h4>
                                <button
                                    type="button"
                                    className="flex items-center btn btn-ghost btn-sm text-error border border-white hover:bg-red-900 hover:text-white rounded-md px-4 py-2 gap-2 cursor-pointer"
                                    onClick={() => removeTestCase(index)}
                                    disabled={testCaseFields.length === 1}
                                >
                                    <Trash2 className="w-5 h-5 mr-1" /> Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border border-white/10 rounded-md p-6">
                                <div className="form-control border border-white/10 rounded-md p-6">
                                    <label className="label">
                                        <span className="label-text font-medium">Input</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                        {...register(`testcases.${index}.input`)}
                                        placeholder="Enter test case input"
                                    />
                                    {errors.testcases?.[index]?.input && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.testcases[index].input.message}</span>
                                        </label>
                                    )}
                                </div>
                                <div className="form-control border border-white/10 rounded-md p-6">
                                    <label className="label">
                                        <span className="label-text font-medium">Expected Output</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                        {...register(`testcases.${index}.output`)}
                                        placeholder="Enter expected output"
                                    />
                                    {errors.testcases?.[index]?.output && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.testcases[index].output.message}</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
