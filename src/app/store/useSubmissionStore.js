import {create} from 'zustand';
import {axiosInstanceSubmissionService} from '../lib/axios';
import {toast} from 'react-hot-toast';
import {io} from 'socket.io-client';

import { getLanguageId } from '../lib/lang';



export const useSubmissionStore = create((set , get) => ({
    
    isCodeRunning:false ,
    isSubmittingCode : false ,
    RunReslts: [],
    userCode : "",
    isexecuting:false,
    submissions : [] ,
    socket : null ,
    selectedLanguage : 'JAVA' ,
    languageId : getLanguageId('JAVA') ,

    setRunResults: (results) => set({ RunReslts: results }),

    // 2. This new function ONLY clears the temporary 'Run Code' results
    clearRunResults: () => set({ RunReslts: [] }),

    // 3. This function will be called by your socket when a submission is graded
  //    Make sure the 'newSubmission' object includes the 'problemId'!
  addSubmission: (newSubmission) => set((state) => ({
    // Adds the new submission to the front of the persistent history
    submissions: [newSubmission, ...state.submissions] 
  })),

    clearResults: () => set({ submissions: [], RunReslts: [] }),

    setUserCode : (code) => {
        set({userCode : code})
    },

    setSelectedLanguage: (langName) => {
        set({
            selectedLanguage: langName,
            languageId: getLanguageId(langName) || null // Update ID based on name
        });
    },

    intializeSocket : async (userId) => {

        let newSocket = get().socket;


        //prevent socket re-intialization if the socket already exist
       if(!newSocket){
           newSocket = io("http://localhost:8080" , {
           withCredentials: true
        });
       }

        //connect the socket
        newSocket.on('connect' , ()=>{

           console.log("✅ Socket connected for submissions:", newSocket.id);

           // Once connected, join the user-specific room
           if(userId){
            newSocket.emit('join-room' , userId);
           }
        })

        //set the newsocket to socket
        set({socket : newSocket});

        //Listen for real-time updates for this user's submissions
        newSocket.on("submission-update", (finalSubmission) => {
            console.log('Received submission update via store:', finalSubmission);
            // Update the specific submission in our state array
            set((state) => ({
                submissions: state.submissions.map(sub =>
                    sub.id === finalSubmission.id ? finalSubmission : sub
                ),
            }));
        });

        newSocket.on("leaderboard-update", (leaderboardData) => {
            console.log('Received leaderboard update via store:', leaderboardData);
            set({ leaderboard: leaderboardData });
        });

        // 2. JOINING PHASE: Ensure we join the room on every navigation
        // Using 'newSocket' for checks now
        if (newSocket && newSocket.connected && userId) {
            console.log("🔄 Re-verifying room join for user:", userId);
            newSocket.emit('join-room', userId);
        }
    } ,


    runCode : async(sourceCode , stdin , languageId , expected_output) => {
        try {

            set({isexecuting : true});

            const result = await axiosInstanceSubmissionService.post("/execute/run-problem" , {sourceCode , stdin , languageId , expected_output})
            set({RunReslts : result.data.testCases});

            console.log("result from run  function from use-submission store........................");
            console.log(result.data.testCases);


        } catch (error) {

            console.log("error occured while running the code" , error);
            toast.error("error occured while running the code");
            
        } finally {

            set({isexecuting : false});
        }
    } ,

    submitCode : async(sourceCode , languageId ,  problemId , contestId) => {
        try {
            
            set({isSubmittingCode : true})

            const result = await axiosInstanceSubmissionService.post(`/execute/submit-code/${contestId}` , {sourceCode , languageId , problemId } ) ;
            set(state => ({
                submissions : [...state.submissions , result.data.submission]
            }))

        } catch (error) {

            console.log("error occured while submitting the code" , error);
            toast.error("error occured while submitting the code");
            
        } finally {
            set({isSubmittingCode : false})
        }
    } ,

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, submissions: [] });
            console.log('Submission socket disconnected.');
        }
    }, 
}))