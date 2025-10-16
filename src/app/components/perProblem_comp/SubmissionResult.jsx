import React from "react";

function determineFinalStatus(runResults) {
  // Check for a compilation error first, as it affects all test cases.
  const compileErrorResult = runResults.find((r) => r.compileOutput);
  if (compileErrorResult) {
    return {
      finalStatus: "Compile Error",
      error: compileErrorResult.compileOutput, // Assuming the error is here
      Memory: null,
      Time: null,
    };
  }

  // Check for a runtime error.
  const runtimeErrorResult = runResults.find(
    (r) => r.status && r.status.includes("Runtime Error")
  );
  if (runtimeErrorResult) {
    return {
      finalStatus: "Runtime Error",
      error: runtimeErrorResult.stderr,
      Memory: null,
      Time: null,
    };
  }

  // Check for the first wrong answer.
  const wrongAnswerResult = runResults.find((r) => r.passed === false);
  if (wrongAnswerResult) {
    return {
      finalStatus: "Wrong Answer",
      // For WA, stderr might be empty. You might want to show input/output diff.
      error: wrongAnswerResult.stderr || "Output did not match expected.",
      Memory: null,
      Time: null,
    };
  }


  // If no errors were found and no test case failed, it's Accepted.
  // Calculate the maximum time and memory used across all successful runs.
  const { maxMemory, maxTime } = runResults.reduce(
    (accumulator, current) => {
      // Get the numeric value from the current item, defaulting to 0
      const currentMemory = parseFloat(current.memory) || 0;
      const currentTime = parseFloat(current.time) || 0;

      // Compare with the accumulated max value (which is already a number)
      accumulator.maxMemory = Math.max(accumulator.maxMemory, currentMemory);
      accumulator.maxTime = Math.max(accumulator.maxTime, currentTime);

      return accumulator;
    },
    { maxMemory: 0, maxTime: 0 } // Your initial value is correct!
  );

  // both memory and time will return the array of memory and time for each test cases

  return {
    finalStatus: "Accepted",
    error: null,
    Memory: maxMemory,
    Time: maxTime,
  };
}

const SubmissionResult = ({ runResults }) => {
  const { finalStatus, error, Memory, Time } = determineFinalStatus(runResults);

  const statusColor =
    finalStatus === "Accepted" ? "text-green-500" : "text-red-500";

  return (
    <div>
      {/* 3. Render the finalStatus and apply the correct color */}
      <h2 className={`text-2xl font-semibold mb-3 ${statusColor}`}>
        {finalStatus}
      </h2>

      {/* Conditionally render details based on the status */}
      <div >
        {finalStatus === "Accepted" ? (
        <div className="flex space-x-4 mb-4 text-gray-400">
          <p>Memory: {Memory} KB</p>
          <p>Time: {Time} s</p>
        </div>
      ) : (
        // Show an error message if one exists
        error && (
          <div className="bg-gray-800 p-4 rounded-md mt-4">
            <h3 className="font-semibold text-white mb-2">Error Details:</h3>
            <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
          </div>
        )
      )}
      </div>
    </div>
  );
};

export default SubmissionResult;
