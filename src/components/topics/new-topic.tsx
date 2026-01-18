import supabase from "@/lib/supabase";
import type { Topic } from "@/types/topic.type";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { CaseSensitive } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, Separator } from "../ui";

dayjs.extend(relativeTime);
dayjs.locale("ko");

function extractTextFromContent(content: string | any[], maxChars = 200) {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    if (!Array.isArray(parsed)) {
      console.warn("content 데이터 타입이 배열이 아닙니다.");
      return "";
    }

    let result = "";
    for (const block of parsed) {
      if (Array.isArray(block.content)) {
        for (const child of block.content) {
          if (child?.text) {
            result += child.text + "";

            if (result.length >= maxChars) {
              return result.slice(0, maxChars) + "...";
            }
          }
        }
      }
    }

    return result.trim();
  } catch (err) {
    console.error("콘텐츠 파싱 실패: ", err);
  }
}

async function findUserById(id: string) {
  try {
    console.log(id);
    let { data: user, error } = await supabase.from("user").select("*").eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }

    console.log(user);

    if (user && user.length > 0) {
      return user[0].email.split("@")[0] + "님";
    } else {
      return "알 수 없는 사용자";
    }
  } catch (error) {
    console.error(error);
    // toast.error(error.message);
    throw error;
  }
}

const NewTopicCard = (props: Topic) => {
  const nav = useNavigate();
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    async function fetchAuthEmail() {
      const nickname = await findUserById(props.author);
      setNickname(nickname || "알 수 없는 사용자");
    }
    fetchAuthEmail();
  }, []);
  return (
    <Card className="w-ful h-fit p-4 gap-4 cursor-pointer" onClick={() => nav(`/topics/${props.id}/detail`)}>
      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col items-start gap-4">
          <h3 className="h-16 text-base font-semibold tracking-tight line-clamp-2">
            <CaseSensitive size={16} className="text-muted-foreground" />
            <p>{props.title}</p>
          </h3>
          <p className="line-clamp-3 text-muted-foreground">{extractTextFromContent(props.content)}</p>
        </div>
        <img src={props.thumbnail} alt="@THUMBNAIL" className="w-[140px] h-[140px] aspect-square rounded-lg object-cover" />
      </div>
      <Separator />
      <div className="w-full flex items-center justify-between">
        <p>{nickname}</p>
        <p>
          {dayjs(props.created_at).format("YYYY. MM. DD")} - ({dayjs(props.created_at).fromNow()})
        </p>
      </div>
    </Card>
  );
};

export { NewTopicCard };
