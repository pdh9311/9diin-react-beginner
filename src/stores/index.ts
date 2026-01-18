import supabase from "@/lib/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";
// const useStore = create((set) => ({
//   bears: 0,
//   ncreasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
// }));

interface User {
  id: string;
  email: string;
  role: string;
}
interface AuthStore {
  user: User | null;
  setUser: (newUser: User | null) => void;
  reset: () => Promise<void>;
}

// export const useAuthStore = create<AuthStore>((set) => ({
//   id: "",
//   email: "",
//   role: "",
//   setId: (newId) => set({ id: newId }),
//   setEmail: (newEmail) => set({ email: newEmail }),
//   setRole: (newRole) => set({ role: newRole }),

//   reset: () => set({ id: "", email: "", role: "" }),
// }));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser: User | null) => set({ user: newUser }),

      // 로그아웃 (상태 + Supabase 세션 모두 제거)
      reset: async () => {
        await supabase.auth.signOut;

        set({ user: null }); // Zustand 상태 초기화
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // user만 저장
    },
  ),
);
