"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { FileText, Loader2 } from "lucide-react";
import { useProblemStore } from "@/store/useProblemStore";
import { useParams, useRouter } from "next/navigation";

import { ProblemSchema, defaultFormValues } from "./problem-form/problemSchema";
import { sampledpData, sampleStringProblem } from "./problem-form/problemSamples";
import { BasicInfoSection } from "./problem-form/BasicInfoSection";
import { TestCasesSection } from "./problem-form/TestCasesSection";
import { TagsSection } from "./problem-form/TagsSection";
import { LanguageSection } from "./problem-form/LanguageSection";
import { AdditionalInfoSection } from "./problem-form/AdditionalInfoSection";

export const CreateProblemForm = () => {
  const { createProblem, isCreatingProblem, UpdateProblem, isUpdatingProblem, getProblemById } = useProblemStore();
  const { id } = useParams();
  const router = useRouter();
  const [problemDetail, setProblemDetail] = useState(null);
  const [sampleType, setSampleType] = useState("DP");

  const form = useForm({
    resolver: zodResolver(ProblemSchema),
    defaultValues: defaultFormValues,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        const res = await getProblemById(id);
        setProblemDetail(res);
      }
    };
    fetchDetail();
  }, [id, getProblemById]);

  useEffect(() => {
    if (problemDetail) {
      form.reset({
        title: problemDetail.title || "",
        description: problemDetail.description || "",
        difficulty: problemDetail.difficulty || "EASY",
        tags: problemDetail.tags || [],
        testcases: problemDetail.testcases || problemDetail.testCases || [{ input: "", output: "" }],
        codeSnippets: problemDetail.codeSnippets || defaultFormValues.codeSnippets,
        referenceSolutions: problemDetail.referenceSolutions || defaultFormValues.referenceSolutions,
        examples: problemDetail.examples || defaultFormValues.examples,
        hints: problemDetail.hints || "",
        editorial: problemDetail.editorial || "",
        timeLimit: problemDetail.timeLimit || 2.0,
        memoryLimit: problemDetail.memoryLimit || 128000,
      });
    }
  }, [problemDetail, form]);

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = async (value) => {
    try {
      if (id) {
        await UpdateProblem(id, value);
        toast.success("Problem updated successfully!");
      } else {
        await createProblem(value);
        toast.success("Problem created successfully!");
      }
      setTimeout(() => {
        router.push("/problems");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(id ? "Error updating problem" : "Error creating problem");
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testcases.map((tc) => tc));
    reset(sampleData);
  };

  const isSubmitting = isCreatingProblem || isUpdatingProblem;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="card bg-black border border-white/10 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b border-white/10">
            <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              {!id ? <span>Create Problem</span> : <span>Edit Problem</span>}
            </h2>

            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button
                type="button"
                className={`btn btn-sm btn-outline btn-primary ${sampleType === "DP" ? "btn-active" : ""}`}
                onClick={() => setSampleType("DP")}
              >
                DP Problem
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-outline btn-primary ${sampleType === "string" ? "btn-active" : ""}`}
                onClick={() => setSampleType("string")}
              >
                String Problem
              </button>
              <button
                type="button"
                className="btn btn-sm btn-success btn-outline"
                onClick={loadSampleData}
              >
                Load Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Modular Form Sections */}
            <BasicInfoSection register={register} errors={errors} />

            <TagsSection
              register={register}
              tagFields={tagFields}
              appendTag={appendTag}
              removeTag={removeTag}
              errors={errors}
            />

            <TestCasesSection
              register={register}
              testCaseFields={testCaseFields}
              appendTestCase={appendTestCase}
              removeTestCase={removeTestCase}
              errors={errors}
            />

            <LanguageSection language="JAVASCRIPT" control={control} register={register} errors={errors} />
            <LanguageSection language="PYTHON" control={control} register={register} errors={errors} />
            <LanguageSection language="JAVA" control={control} register={register} errors={errors} />

            <AdditionalInfoSection register={register} errors={errors} />

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.push("/problems")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary min-w-32 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : id ? (
                  "Update Problem"
                ) : (
                  "Create Problem"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};