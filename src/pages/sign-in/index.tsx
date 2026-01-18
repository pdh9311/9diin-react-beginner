import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(8, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
  }),
});

const SignIn = () => {
  const nav = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setUser = useAuthStore((state) => state.setUser);

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();

  //     if (session?.user) {
  //       setUser({
  //         id: session.user.id,
  //         email: session.user.email as string,
  //         role: session.user.role as string,
  //       });
  //       nav("/");
  //     }
  //   };
  //   checkSession();
  // }, []);

  // 소셜로그인(구글 로그인)
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { access_type: "offline", prompt: "consent" },
        redirectTo: `${import.meta.env.VITE_SUPABASE_BASE_URL}/auth/callback`, // 로그인 후 돌아올 URL - 도메인
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }
  };

  // 일반로그인
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      if (user && session) {
        // data -> session, user 데이터 전달
        console.log(user);
        setUser({
          id: user.id,
          email: user.email as string,
          role: user.role as string,
        });
        toast.success("로그인을 성공하였습니다.");
        nav("/");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`${error}`);
    }
  };
  return (
    <main className="w-full h-full min-h-180 flex p-6 gap-6 items-center justify-center">
      <div className="w-100 max-w-100 flex flex-col px-6 gap-6">
        <div className="flex flex-col">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">로그인</h4>
          <p className="text-muted-foreground">로그인을 위한 정보를 입력해주세요.</p>
        </div>
        <div className="grid gap-3">
          <Button type="button" variant={"secondary"} onClick={handleGoogleSignIn}>
            <img src="/assets/icons/social/google.svg" alt="@GOGGLE-LOGO" className="w-[18px] h-[18px] mr-1" />
            구글 로그인
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 text-muted-foreground bg-black uppercase">OR CONTINUE WITH</span>
            </div>
          </div>
          {/* 로그인 폼 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일 주소를 입력하세요." {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="비밀번호를 입력하세요." {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-col gap-3">
                <Button type="submit" variant={"outline"} className="flex-1 !bg-sky-800/50">
                  로그인
                </Button>
                <div className="text-center">
                  계정이 없으신가요?
                  <NavLink to={"/sign-up"} className="underline ml-1">
                    회원가입
                  </NavLink>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
