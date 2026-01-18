import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const AuthCallback = () => {
  const nav = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        console.error("세션에 사용자 정보가 없습니다");
        return;
      }

      const user = session.user;

      if (!user.id) {
        console.log("유저 ID가 없습니다");
        return;
      }

      try {
        let { data: existing, error: selectError } = await supabase.from("user").select("*").eq("id", user.id).single();

        if (selectError) {
          console.error("USER 테이블 조회중 에러발생하였습니다.");
          return;
        }

        if (!existing) {
          const { error: insertError } = await supabase
            .from("user")
            .insert([{ id: user.id, email: user.email, service_agreed: true, privacy_agreed: true, marketing_agreed: false }]);

          if (insertError) {
            console.error("USER 테이블 삽입 중 에러가 발생하였습니다.");
            return;
          }

          setUser({
            id: user.id,
            email: user.email || "알 수 없는 사용자",
            role: user.role || "",
          });
          nav("/");
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
};

export default AuthCallback;
