// src/app/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstanceAuthService } from "@/app/lib/axios";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
  authUser: null,
  isAuthenticated: false,
  isCheckingAuth: true,     // <-- start TRUE
  isLoggingIn: false,
  isSigninUp: false,
   signup: async (payload) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstanceAuthService.post("/auth/register", payload, { withCredentials: true });
      if (res?.status === 200 && res?.data?.status === true && res?.data?.user) {
        set({ authUser: res.data.user, isAuthenticated: true });
        toast.success(res?.data?.message || "Signup successful");
        return true;
      }
      toast.error(res?.data?.message || "Signup failed");
      return false;
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error signing up");
      return false;
    } finally {
      set({ isSigninUp: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstanceAuthService.get(`/auth/check-Auth?t=${Date.now()}`, {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (res?.data?.success && res?.data?.user) {
        set({ authUser: res.data.user, isAuthenticated: true });
      } else {
        set({ authUser: null, isAuthenticated: false });
      }
    } catch {
      set({ authUser: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false }); // <-- guard now knows check is done
    }
  },

  login: async (payload) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstanceAuthService.post("/auth/login", payload, { withCredentials: true });
      const userPayload = res?.data?.data;
      if (res?.status === 200 && userPayload) {
        set({ authUser: userPayload, isAuthenticated: true });
        toast.success("Login successful");
        return true;
      }
      toast.error(res?.data?.message || "Invalid credentials");
      return false;
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error logging in");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstanceAuthService.post("/auth/logout", null, { withCredentials: true });
      set({ authUser: null, isAuthenticated: false });
      toast.success("Logout successful");
      return true;
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error logging out");
      return false;
    }
  },
}));
