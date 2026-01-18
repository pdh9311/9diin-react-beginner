import { useAuthStore } from "@/stores";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { Separator } from "../ui";

const AppHeader = () => {
  const nav = useNavigate();

  const user = useAuthStore((state) => state.user);
  const reset = useAuthStore((state) => state.reset);

  const handleLogout = async () => {
    try {
      await reset(); // Zustand + Supabase 모두 로그아웃
      toast.success("로그아웃 되엇습니다.");
      nav("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("로그아웃 중 오류가 발생햇습니다");
    }
  };

  return (
    <header className="fixed top-0 z-20 w-full flex items-center justify-center bg-[#121212]">
      <div className="w-full max-w-332 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-5">
          <img src="https://github.com/9diin.png" alt="@LOGO" className="w-6 h-6 cursor-pointer" />
          <div className="flex items-center gap-5">
            <NavLink to={"/"} className="font-semibold">
              토픽 인사이트
            </NavLink>
            <Separator orientation="vertical" className="h-4!" />
            <NavLink to={"/portfolio"} className="font-semibold">
              포트폴리오
            </NavLink>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-5">
            <span>{user.email}</span>
            <Separator orientation="vertical" className="!h-4" />
            <span onClick={handleLogout} className="cursor-pointer">
              로그아웃
            </span>
          </div>
        ) : (
          <NavLink to={"/sign-in"}>로그인</NavLink>
        )}
      </div>
    </header>
  );
};

export { AppHeader };
