import { create } from "zustand";
import { axiosInstanceAuthService } from "@/lib/axios";
import { toast } from "react-toastify";




export const useAdminStore = create((set) =>

(
    {
        allUsers: [],
        isLoadingUsers: false,
        isUpdatingRole:false,
        isDeletingUser:false,

        fetchAllUsers: async () => {
            try {
                set({ isLoadingUsers: true })
                const res = await axiosInstanceAuthService.get("/admin/getallusers", { withCredentials: true });
                console.log("All users response:", res.data);
                if (res?.status === 200) {
                    
                    set({ allUsers: res.data?.users });
                    toast.success(res?.data?.message || "Users fetched successfully");
                    return true;
                }

            } catch (error) {
                console.log(error);

            }

        },

    UpdateUser: async (userId, data) => {
  console.log(userId, data);

  try {
    set({ isUpdatingRole: true });

    const res = await axiosInstanceAuthService.put(
      "/admin/updateuser",
      { userId, data },
      { withCredentials: true }
    );

    console.log("Update role response:", res);

    if (res?.status === 200 ) {
      set((state) => ({
        allUsers: state.allUsers.map((user) =>
         {console.log(user.id,userId);
         
            return user.id === userId ? { ...user, role: data.role, username: data.username } : user}
        ),
      }));

      toast.success(res?.data?.message || "User role updated successfully");
      return true;
    }

  } catch (error) {
    console.log(error);
    toast.error("Error updating user role");
  } finally {
    set({ isUpdatingRole: false });
  }
},

        DeleteUser:async(userid)=>{
        console.log(userid);
        
            try {
                set({isDeletingUser:true})
                     const res=await axiosInstanceAuthService.delete(`/admin/deleteuser/${userid}`,{withCredentials:true});


                        console.log("Delete user response:",res);

                        if(res?.status===200 && res?.data?.status===true){

                            set((state)=>({
                                allUsers: state.allUsers.filter(u => u.id !== userid)
                            }))
                      toast.success(res?.data?.message || "User Deleted successfully");
                        return true;    

                        }
            } catch (error) {
                 console.log(error)
                toast.error("Error While deleting user ");
                set({isDeletingUser:false})
            }
        }
    }
)
)