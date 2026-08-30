import { create } from "zustand";
import { axiosInstanceAuthService, axiosInstanceProblemService } from "@/lib/axios";
import { toast } from "react-toastify";




export const useAdminStore = create((set) =>

(
    {
        allUsers: [],
        isLoadingUsers: false,
        isUpdatingRole:false,
        isDeletingUser:false,
        isResettingCdn:false,

        fetchAllUsers: async () => {
            try {
                set({ isLoadingUsers: true })
                const res = await axiosInstanceAuthService.get("/admin/getallusers", { withCredentials: true });
                if (res?.status === 200) {
                    set({ allUsers: res.data?.users });
                    return true;
                }
            } catch (error) {
                console.error(`[useAdminStore] fetchAllUsers [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
                toast.error(error.normalizedMessage || "Error fetching users");
            } finally {
                set({ isLoadingUsers: false })
            }
        },

    UpdateUser: async (userId, data) => {
  try {
    set({ isUpdatingRole: true });
    const res = await axiosInstanceAuthService.put(
      "/admin/updateuser",
      { userId, data },
      { withCredentials: true }
    );

    if (res?.status === 200 ) {
      set((state) => ({
        allUsers: state.allUsers.map((user) =>
           user.id === userId ? { ...user, role: data.role, username: data.username } : user
        ),
      }));
      toast.success(res?.data?.message || "User updated successfully");
      return true;
    }
  } catch (error) {
    console.error(`[useAdminStore] UpdateUser [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
    toast.error(error.normalizedMessage || "Error updating user");
  } finally {
    set({ isUpdatingRole: false });
  }
},

        DeleteUser:async(userid)=>{
            try {
                set({isDeletingUser:true})
                const res=await axiosInstanceAuthService.delete(`/admin/deleteuser/${userid}`,{withCredentials:true});

                if(res?.status===200 && res?.data?.status===true){
                    set((state)=>({
                        allUsers: state.allUsers.filter(u => u.id !== userid)
                    }))
                    toast.success(res?.data?.message || "User deleted successfully");
                    return true;    
                }
            } catch (error) {
                console.error(`[useAdminStore] DeleteUser [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
                toast.error(error.normalizedMessage || "Error deleting user");
            } finally {
                set({isDeletingUser:false})
            }
        },

        resetCdnCache: async () => {
            try {
                set({ isResettingCdn: true });
                const res = await axiosInstanceProblemService.post(
                    "/problem/admin/cache/purge",
                    {},
                    { withCredentials: true }
                );

                if (res?.status === 200) {
                    const message = res?.data?.message || "CDN cache reset requested";
                    if (res?.data?.result?.skipped) {
                        toast.info(message);
                    } else {
                        toast.success(message);
                    }
                    return true;
                }
            } catch (error) {
                console.error(`[useAdminStore] resetCdnCache [${error.errorCode}] ${error.normalizedMessage}`, { traceId: error.traceId });
                toast.error(error.normalizedMessage || "Error resetting CDN cache");
            } finally {
                set({ isResettingCdn: false });
            }
        }
    }
)
)
