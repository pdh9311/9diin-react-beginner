import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AuthCallback = () => {
  const nav = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // 1. 현재 세션 정보 가져오기
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // 2. 세션 오류 똔느 세션이 없는 경우 처리
      if (sessionError || !session) {
        console.error("세션 처리 오류, 다시 로그인 페이지로 이동합니다.", sessionError);
        toast.error("록읜 처리 중 오류가 발생했습니다.");

        // 로그인 페이지로 이동
        nav("/sign-in");
        return;
      }

      // 3. 세션이 정상인 경우: DB 삽입 로직은 이미 Trigger가 처리했으므로,
      // 별도의 public.user 삽입 코드 없이 바로 메인 페이지로 리디렉션합니다.

      // 메임 페이지로 리디렉션
      toast.success("로그인을 성공하였습니다.");
    };

    // 이 useEffect는 OAuth 리디렉션 후 실행되며,
    // URL의 "code"나 해시를 통해 Supabase 세션이 이미 저장된 상태일 것입니다.
    handleAuthCallback();

    // const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    //   if (!session?.user) {
    //     console.error("세션에 사용자 정보가 없습니다");
    //     return;
    //   }

    //   const user = session.user;

    //   if (!user.id) {
    //     console.log("유저 ID가 없습니다");
    //     return;
    //   }

    //   try {
    //     let { data: existing, error: selectError } = await supabase.from("user").select("*").eq("id", user.id).single();

    //     if (selectError) {
    //       console.error("USER 테이블 조회중 에러발생하였습니다.");
    //       return;
    //     }

    //     if (!existing) {
    //       const { error: insertError } = await supabase
    //         .from("user")
    //         .insert([{ id: user.id, email: user.email, service_agreed: true, privacy_agreed: true, marketing_agreed: false }]);

    //       if (insertError) {
    //         console.error("USER 테이블 삽입 중 에러가 발생하였습니다.");
    //         return;
    //       }

    //       setUser({
    //         id: user.id,
    //         email: user.email || "알 수 없는 사용자",
    //         role: user.role || "",
    //       });
    //       nav("/");
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });

    // return () => {
    //   listener.subscription.unsubscribe();
    // };
  }, [nav]);

  return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
};

export default AuthCallback;
