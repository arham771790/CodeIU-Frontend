import React from "react";
import { Code2, CheckCircle2 } from "lucide-react";
import { Controller } from "react-hook-form";
import Editor from "@monaco-editor/react";

export const LanguageSection = ({ language, control, register, errors }) => {
    return (
        <div className="card bg-base-200 p-4 md:p-6 shadow-md border border-white/10 rounded-md p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                {language}
            </h3>

            <div className="space-y-6">
                {/* Starter Code */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">Starter Code Template</h4>
                        <div className="border rounded-md overflow-hidden">
                            <Controller
                                name={`codeSnippets.${language}`}
                                control={control}
                                render={({ field }) => (
                                    <Editor
                                        height="300px"
                                        language={language.toLowerCase()}
                                        theme="vs-dark"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: "on",
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {errors.codeSnippets?.[language] && (
                            <div className="mt-2 text-error text-sm">{errors.codeSnippets[language].message}</div>
                        )}
                    </div>
                </div>

                {/* Reference Solution */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            Reference Solution
                        </h4>
                        <div className="border rounded-md overflow-hidden">
                            <Controller
                                name={`referenceSolutions.${language}`}
                                control={control}
                                render={({ field }) => (
                                    <Editor
                                        height="300px"
                                        language={language.toLowerCase()}
                                        theme="vs-dark"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: "on",
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {errors.referenceSolutions?.[language] && (
                            <div className="mt-2 text-error text-sm">{errors.referenceSolutions[language].message}</div>
                        )}
                    </div>
                </div>

                {/* Examples */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">Example</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="form-control border border-white/10 rounded-md p-6">
                                <label className="label">
                                    <span className="label-text font-medium">Input</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                                    {...register(`examples.${language}.input`)}
                                    placeholder="Example input"
                                />
                                {errors.examples?.[language]?.input && (
                                    <label className="label text-error text-sm">{errors.examples[language].input.message}</label>
                                )}
                            </div>
                            <div className="form-control border border-white/10 rounded-md p-6">
                                <label className="label">
                                    <span className="label-text font-medium">Output</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                                    {...register(`examples.${language}.output`)}
                                    placeholder="Example output"
                                />
                                {errors.examples?.[language]?.output && (
                                    <label className="label text-error text-sm">{errors.examples[language].output.message}</label>
                                )}
                            </div>
                            <div className="form-control md:col-span-2 border border-white/10 rounded-md p-6">
                                <label className="label">
                                    <span className="label-text font-medium">Explanation</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                    {...register(`examples.${language}.explanation`)}
                                    placeholder="Explain the example"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
