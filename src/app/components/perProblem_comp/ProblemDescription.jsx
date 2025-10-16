"use client";

import React from "react";
import { Code2, Expand, ThumbsUp, ThumbsDown, Book } from "lucide-react";

const Code = (props) => (
  <span
    {...props}
    className="font-mono bg-zinc-700 bg-opacity-50 rounded px-1.5 py-0.5 text-sm text-gray-300"
  >
    {props.children}
  </span>
);

const ProblemDescription = ({ title, description, testcases, constraints }) => {
  const visibleTestCase = testcases?.slice(0, 2);

  return (
    <div className="bg-[#212121] text-gray-300 flex flex-col h-full overflow-y-auto rounded-lg">
      <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-sm">
        <div className="flex items-center space-x-2">
          <button className=" flex items-center space-x-1 font-semibold hover:bg-zinc-800 rounded px-2 py-1 text-white">
            <Book className=" text-blue-400 w-4 h-4" />
            <span className="ml-1">Description</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="hover:bg-zinc-800 p-1 rounded">
            <Code2 className="w-5 h-5 text-gray-400" />
          </button>
          <button className="hover:bg-zinc-800 p-1 rounded">
            <Expand className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-medium text-white mb-2">{`Q : ${title}`}</h2>

        <p className="text-m mb-4 font-sans">{description}</p>

        <p className="font-semibold text-white mb-2">Examples:</p>
        {visibleTestCase?.map((testCase, index) => (
          <div key={index} className="mb-4 bg-zinc-800 rounded-lg p-4">
            <p className="text-sm font-mono mb-2">
              {index + 1}.
              <span className="font-bold text-gray-400"> Input: </span>
              {testCase?.input}
            </p>
            <p className="text-sm font-mono ml-6">
              <span className="font-bold text-gray-400"> Output: </span>
              {testCase?.output}
            </p>
          </div>
        ))}

        <p className="font-semibold text-white mb-2">Constraints:</p>
        <ul className="list-disc list-inside text-sm space-y-1 font-sans">
          <li>
            <Code>{constraints}</Code>
          </li>
        </ul>
      </div>

      <div className="flex-shrink-0 px-4 py-2 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1.5 hover:bg-zinc-800 p-1.5 rounded">
            <ThumbsUp className="w-4 h-4" />{" "}
            <span className="text-xs">64.3K</span>
          </button>
          <button className="flex items-center space-x-1.5 hover:bg-zinc-800 p-1.5 rounded">
            <ThumbsDown className="w-4 h-4" />{" "}
            <span className="text-xs">1.6K</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>2361 Online</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
