"use client";

import { useState } from "react";
import Portal from "@/components/atoms/Portal";
import { useAdminStore } from "@/store/useAdminStore";

const Modal = ({ isOpen, setisEditing, user }) => {
  if (!isOpen) return null;

  const [role, setRole] = useState(user.role);
  const [username, setUsername] = useState(user.username);
  const { UpdateUser } = useAdminStore();

  const handleupdate = async (e) => {
    e.preventDefault();
    try {
      const data = { role, username };
      await UpdateUser(user.id, data);
      setisEditing(false);
    } catch (error) {
      console.error('Error while Updating:', error);
    }
  };

  const onclose = () => {
    setisEditing(false);
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
        <div className="bg-base-100 border border-base-content/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl transition-all animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-base-content">
              Edit <span className="text-primary">User Profile</span>
            </h2>
            <button
              onClick={onclose}
              className="btn btn-circle btn-ghost btn-sm text-base-content/40 hover:bg-base-content/10"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleupdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-4">System Role</label>
              <select
                className="select select-bordered w-full rounded-2xl bg-base-content/5 border-base-content/5 focus:border-primary focus:ring-1 focus:ring-primary/50 font-bold transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">Standard User</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 ml-4">Username</label>
              <input
                type="text"
                value={username}
                className="input input-bordered w-full rounded-2xl bg-base-content/5 border-base-content/5 focus:border-primary focus:ring-1 focus:ring-primary/50 font-bold transition-all"
                placeholder="Enter Username..."
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="btn btn-primary w-full rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
              >
                Update System Identity
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
