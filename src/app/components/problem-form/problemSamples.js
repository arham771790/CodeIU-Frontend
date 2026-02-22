export const sampledpData = {
  title: "Climbing Stairs",
  category: "dp",
  description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints: "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial: "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    { input: "2", output: "2" },
    { input: "3", output: "3" },
    { input: "4", output: "5" },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation: "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation: "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**\n* @param {number} n\n* @return {number}\n*/\nfunction climbStairs(n) {\n// Write your code here\n}`,
    PYTHON: `class Solution:\n  def climbStairs(self, n: int) -> int:\n      # Write your code here\n      pass`,
    JAVA: `import java.util.Scanner;\n\nclass Main {\n  public int climbStairs(int n) {\n      // Write your code here\n      return 0;\n  }\n}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let dp = [0, 1, 2];\n  for (let i = 3; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n  return dp[n];\n}`,
    PYTHON: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1): a, b = b, a + b\n        return b`,
    JAVA: `class Main {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = a + b; a = b; b = temp;\n        }\n        return b;\n    }\n}`,
  },
};

export const sampleStringProblem = {
  title: "Valid Palindrome",
  description: "Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints: "1 <= s.length <= 2 * 10^5",
  hints: "Consider using two pointers, one from the start and one from the end.",
  editorial: "We can use two pointers approach to check if the string is a palindrome.",
  testcases: [
    { input: "A man, a plan, a canal: Panama", output: "true" },
    { input: "race a car", output: "false" },
  ],
  examples: {
    JAVASCRIPT: { input: 's = "A man"', output: "true", explanation: "..." },
    PYTHON: { input: 's = "A man"', output: "true", explanation: "..." },
    JAVA: { input: 's = "A man"', output: "true", explanation: "..." },
  },
  codeSnippets: {
    JAVASCRIPT: `function isPalindrome(s) {\n  // Write your code here\n}`,
    PYTHON: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass`,
    JAVA: `public class Main {\n    public static boolean isPalindrome(String s) {\n        return true;\n    }\n}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function isPalindrome(s) {\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return s === s.split('').reverse().join('');\n}`,
    PYTHON: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        s = "".join(c.lower() for c in s if c.isalnum())\n        return s == s[::-1]`,
    JAVA: `public class Main {\n    public static boolean isPalindrome(String s) {\n        String f = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        return f.equals(new StringBuilder(f).reverse().toString());\n    }\n}`,
  },
};
