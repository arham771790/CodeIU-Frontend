import React from "react";

function determineFinalStatus(runResults) {
  const compileError = runResults.find(r => r.compileOutput);
  if (compileError) return { finalStatus: "Compile Error", error: compileError.compileOutput };

  const runtimeError = runResults.find(r => r.status?.includes("Runtime Error"));
  if (runtimeError) return { finalStatus: "Runtime Error", error: runtimeError.stderr };

  const wrongAnswer = runResults.find(r => !r.passed);
  if (wrongAnswer) return { finalStatus: "Wrong Answer", error: "Output did not match expected." };

  const maxStats = runResults.reduce((acc, curr) => ({
    maxMemory: Math.max(acc.maxMemory, parseFloat(curr.memory) || 0),
    maxTime: Math.max(acc.maxTime, parseFloat(curr.time) || 0)
  }), { maxMemory: 0, maxTime: 0 });

  return { finalStatus: "Accepted", Memory: maxStats.maxMemory, Time: maxStats.maxTime };
}

const SubmissionResult = ({ runResults }) => {
  const { finalStatus, error, Memory, Time } = determineFinalStatus(runResults);
  const statusColor = finalStatus === "Accepted" ? "text-success" : "text-error";

  return (
    <div className="space-y-3">
      <h2 className={`text-2xl font-black uppercase tracking-tight ${statusColor}`}>{finalStatus}</h2>
      <div className="bg-base-300/40 p-4 rounded-xl border border-base-content/5">
        {finalStatus === "Accepted" ? (
          <div className="flex gap-6 text-sm font-mono font-bold opacity-60">
            <span>TIME: {Time}s</span>
            <span>MEMORY: {Memory}KB</span>
          </div>
        ) : (
          <pre className="text-error text-xs font-mono whitespace-pre-wrap">{error}</pre>
        )}
      </div>
    </div>
  );
};

export default SubmissionResult;