import {create} from 'zustand';
import { axiosInstanceProblemService } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useProblemStore = create((set) => ({
    
  problems: [],
  problem: null,
  solvedProblemsIds: [], 
  isSolvedLoading: false, 
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isCreatingProblem: false,

  isDeletingProblem: false ,
  isUpdatingProblem : false ,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstanceProblemService.get("/problem/getAllProblem");
      console.log("All problems fetched:", res.data.problems);
      set({ problems: res.data.problems || [] });
    } catch (error) {
      console.error("Error fetching all problems:", error);
      toast.error("Error fetching problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  fetchUserSolvedProblems: async () => {
    try {
      set({ isSolvedLoading: true });
      // This automatically sends the user's auth cookie because it's client-side axios
      const res = await axiosInstanceProblemService.get("/problem/solved-problems");
      console.log("Solved problems:", res.data.solvedProblem);
      const ids = (res.data.solvedProblem || []).map(s => s.problemId);
      set({ solvedProblemsIds: ids });
    } catch (error) {
      console.error("Error fetching solved problems", error);
    } finally {
      set({ isSolvedLoading: false });
    }
  },

  createProblem : async(data) => {
    try {

        set({ isCreatingProblem : true })

        const result = await axiosInstanceProblemService.post("/problem/createProblem", data)
        console.log("....................responce from create problem function .............................");
        console.log(result);
        toast.success("problem created successfully")
        
    } catch (error) {
        console.log("error occured while creating problem", error)
        toast.error("error occured while creating problem")
        
    } finally {
        set({ isCreatingProblem : false })
    }
  } ,

  getProblemById : async(ProblemID) => {
     try {
       set({ isProblemLoading : true })
       const res = await axiosInstanceProblemService.get(`/problem/getProblem/${ProblemID}`);
       const prob = res?.data?.problem;

       // 🔎 LOG: raw and summarized testcase sources
       console.log("[ProblemStore] getProblemById raw:", res?.data);
       console.log("[ProblemStore] getProblemById keys:", Object.keys(prob || {}));
       console.log("[ProblemStore] testcases lengths:", {
         testcases: Array.isArray(prob?.testcases) ? prob.testcases.length : 0,
         testCases: Array.isArray(prob?.testCases) ? prob.testCases.length : 0,
         publicTestcases: Array.isArray(prob?.publicTestcases) ? prob.publicTestcases.length : 0,
         hiddenTestcases: Array.isArray(prob?.hiddenTestcases) ? prob.hiddenTestcases.length : 0,
         privateTestcases: Array.isArray(prob?.privateTestcases) ? prob.privateTestcases.length : 0,
       });
       console.log("[ProblemStore] first few examples:", {
         exJS: prob?.examples?.JAVASCRIPT,
         exPY: prob?.examples?.PYTHON,
         exJAVA: prob?.examples?.JAVA,
         exCPP: prob?.examples?.CPP,
       });

       set({ problem: prob });
       return prob;

    } catch (error) {

        console.log("error occured while fetching problem by id");
        toast.error("error occured while fetching problem by id ");
        
    }
    finally{
        set({ isProblemLoading : false })
    }

  } ,

  //function of getProblem Solved by user will be added in the future
  //function of update and delete problem will be added in the future

  UpdateProblem : async() => {
    try {
      
    } catch (error) {
      
    }
  } ,

  deleteProblem : async(ProblemId) => {
    try {

      set({isDeletingProblem : true})

      await axiosInstanceProblemService.delete(`/problem/deleteProblem/${ProblemId}`);

      set((state)=>({
        problems : state.problems.filter(problem => problem.id !== ProblemId)
      }))
      
    } catch (error) {
      console.log("error occured while deleting problem :" , error);
      toast.error("error occured while deleting problem");
      
    } finally {
      set({isDeletingProblem : false})
    }
  }

}))