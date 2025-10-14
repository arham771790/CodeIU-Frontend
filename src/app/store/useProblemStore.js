import {create} from 'zustand';
import { axiosInstanceProblemService } from '../lib/axios';
import { toast } from 'react-hot-toast';




export const useProblemStore = create((set) => ({
    
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isCreatingProblem: false,


  createProblem : async(data) => {
    try {

        set({ isCreatingProblem : true })

        const result = await axiosInstanceProblemService.post("/problem/createProblem", data)
        toast.success("problem created successfully")
        
    } catch (error) {
        console.log("error occured while creating problem", error)
        toast.error("error occured while creating problem")
        
    } finally {
        set({ isCreatingProblem : false })
    }
  } ,

  getAllProblems : async() => {

    try {

        set({ isProblemsLoading : true });
        const result = await axiosInstanceProblemService.get("/problem/getAllProblem")

        set({ problems : result.data.problems })
        
    } catch (error) {

        console.log("error occured while fteching problem", error)
        toast.error("erro occured while fetching all problems")
        
    }
    finally{
        set({isProblemsLoading : false })
    }

  } ,

  getProblemById : async(ProblemID) => {
    try {

        set({ isProblemLoading : true })        
        const result = await axiosInstanceProblemService.get(`/problem/getProblem/${ProblemID}`)
        set({problem : result.data.problem })
        
        toast.success(result.data.message)

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

}))
