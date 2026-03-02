import React from "react";

function determineFinalStatus(runResults, isCustom) {
  const compileError = runResults.find(r => r.compileOutput);
  if (compileError) return { finalStatus: "Compile Error", error: compileError.compileOutput };

  const runtimeError = runResults.find(r => r.status?.includes("Runtime Error"));
  if (runtimeError) return { finalStatus: "Runtime Error", error: runtimeError.stderr };

  if (isCustom) {
    return { finalStatus: "Finished", isCustom: true };
  }

  const wrongAnswer = runResults.find(r => !r.passed);
  if (wrongAnswer) return { finalStatus: "Wrong Answer", error: "Output did not match expected." };

  const maxStats = runResults.reduce((acc, curr) => ({
    maxMemory: Math.max(acc.maxMemory, parseFloat(curr.memory) || 0),
    maxTime: Math.max(acc.maxTime, parseFloat(curr.time) || 0)
  }), { maxMemory: 0, maxTime: 0 });

  return { finalStatus: "Accepted", Memory: maxStats.maxMemory, Time: maxStats.maxTime };
}

const SubmissionResult = ({ runResults, isCustom }) => {
  const { finalStatus, error, Memory, Time } = determineFinalStatus(runResults, isCustom);
  const statusColor = finalStatus === "Accepted" || finalStatus === "Finished" ? "text-success" : "text-error";

  return (
    <div className="space-y-3">
      <h2 className={`text-2xl font-black uppercase tracking-tight ${statusColor}`}>{finalStatus}</h2>

      {isCustom && runResults[0] && (
        <div className="bg-base-300/40 p-4 rounded-xl border border-base-content/5 space-y-3">
          <div className="flex gap-6 text-[10px] font-mono font-bold opacity-30 uppercase tracking-widest">
            <span>TIME: {runResults[0].time || 'N/A'}</span>
            <span>MEMORY: {runResults[0].memory || 'N/A'}</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-2">Standard Output</p>
            <pre className="bg-base-300/60 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap min-h-[50px]">
              {runResults[0].stdout || 'No Output'}
            </pre>
          </div>
        </div>
      )}

      {!isCustom && (
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
      )}
    </div>
  );
};

export default SubmissionResult;