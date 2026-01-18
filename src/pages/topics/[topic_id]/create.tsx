import { AppEditor, AppFileUpload } from "@/components/common";
import { Button, Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { TOPIC_CATEGORY } from "@/constants/category.contstant";
import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { TOPIC_STATUS } from "@/types/topic.type";
import type { Block } from "@blocknote/core";
import { ArrowLeft, Asterisk, BookOpenCheck, ImageOff, Save } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CreateTopic = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<Block[]>([]);
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);

  const fetchTopic = async () => {
    try {
      let { data: topic, error } = await supabase.from("topic").select("*").eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
      if (topic) {
        console.log(topic);
        setTitle(topic[0].title);
        setContent(JSON.parse(topic[0].content));
        setCategory(topic[0].category);
        setThumbnail(topic[0].thumbnail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchTopic();
    }, 1000);
  }, []);

  const handleSave = async () => {
    if (!title && !content && !category && !thumbnail) {
      toast.warning("제목, 본문, 카테고리, 썸네일은 기입하세요.");
      return;
    }

    // 이미지 저장 Supabase-Storage
    let thumbnailUrl: string | null = null;
    if (thumbnail && thumbnail instanceof File) {
      const fileExt = thumbnail.name.split(".").pop();
      const filename = `${nanoid()}.${fileExt}`;
      const filePath = `topics/${filename}`;

      const { error: uploadError } = await supabase.storage.from("files").upload(filePath, thumbnail);
      if (uploadError) throw uploadError;
      // 업로드된 이미지의 public URL 값 가져오기
      const { data } = await supabase.storage.from("files").getPublicUrl(filePath);
      if (!data) throw new Error("썸네일 Public URL 조회를 실패했습니다.");
      thumbnailUrl = data.publicUrl;
    } else if (typeof thumbnail === "string") {
      thumbnailUrl = thumbnail;
    }

    // RLS Policy 설정할 때, auth.uid() = author
    const { data, error } = await supabase
      .from("topic")
      .update([{ status: TOPIC_STATUS.TEMP, title, content: JSON.stringify(content), category, thumbnail: thumbnailUrl, author: user?.id }])
      .eq("id", id)
      .select();

    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) {
      toast.success("작성중인 토픽을 저장하였습니다.");
      return;
    }
  };

  const handlePublish = async () => {
    if (!title || !content || !category || !thumbnail) {
      toast.warning("제목, 본문, 카테고리, 썸네일은 필수값입니다.");
      return;
    }

    // 이미지 저장 Supabase-Storage
    let thumbnailUrl: string | null = null;
    if (thumbnail && thumbnail instanceof File) {
      const fileExt = thumbnail.name.split(".").pop();
      const filename = `${nanoid()}.${fileExt}`;
      const filePath = `topics/${filename}`;

      const { error: uploadError } = await supabase.storage.from("files").upload(filePath, thumbnail);
      if (uploadError) throw uploadError;
      // 업로드된 이미지의 public URL 값 가져오기
      const { data } = await supabase.storage.from("files").getPublicUrl(filePath);
      if (!data) throw new Error("썸네일 Public URL 조회를 실패했습니다.");
      thumbnailUrl = data.publicUrl;
    } else if (typeof thumbnail === "string") {
      thumbnailUrl = thumbnail;
    }

    // RLS Policy 설정할 때, auth.uid() = author
    const { data, error } = await supabase
      .from("topic")
      .update([{ status: TOPIC_STATUS.PUBLISH, title, content: JSON.stringify(content), category, thumbnail: thumbnailUrl, author: user?.id }])
      .eq("id", id)
      .select();

    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) {
      toast.success("토픽을 발행하였습니다.");
      nav("/");
      return;
    }
  };

  return (
    <main className="w-full h-full min-h-[1024px] flex gap-6  p-6">
      <div className="fixed right-1/2 bottom-10 translate-x-1/2 z-20 flex items-center gap-2">
        <Button variant={"outline"} size={"icon"}>
          <ArrowLeft />
        </Button>
        <Button type="button" variant={"outline"} className="w-20 !bg-yellow-800/50" onClick={handleSave}>
          <Save />
          저장
        </Button>
        <Button type="button" variant={"outline"} className="w-20 !bg-emerald-800/50" onClick={handlePublish}>
          <BookOpenCheck />
          발행
        </Button>
      </div>
      <section className="w-3/4 h-full flex flex-col gap-6">
        <div className="flex flex-col pb-6 border-b">
          <span className="text-[#f96859] font-semibold">Step 1</span>
          <span className="text-base font-semibold">토픽 작성하기</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Asterisk size={14} className="text-[#f96859]" />
            <Label className="text-muted-foreground">제목</Label>
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="토픽 제목을 입력하세요"
            className="h-16 pl-6 !text-lg placeholder:text-lg placeholder:font-semibold border-0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Asterisk size={14} className="text-[#f96859]" />
            <Label className="text-muted-foreground">본문</Label>
          </div>
          {/* <Textarea placeholder="토픽 내용을 입력하세요." className="w-full h-100 border-0" /> */}
          <AppEditor props={content} setContent={setContent} />
        </div>
      </section>
      <section className="w-1/4 h-full flex flex-col gap-6">
        <div className="flex flex-col pb-6 border-b">
          <span className="text-[#f96859] font-semibold">Step 2</span>
          <span className="text-base font-semibold">카테고리 및 썸네일 등록</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Asterisk size={14} className="text-[#f96859]" />
            <Label className="text-muted-foreground">카테고리</Label>
          </div>
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="토픽(주제) 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TOPIC_CATEGORY.map((topic) => {
                  return (
                    <SelectItem key={topic.id} value={topic.category}>
                      {topic.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Asterisk size={14} className="text-[#f96859]" />
            <Label className="text-muted-foreground">썸네일</Label>
          </div>
          <AppFileUpload file={thumbnail} onChange={setThumbnail} />
          <Button variant={"outline"} className="border-0" onClick={() => setThumbnail(null)}>
            <ImageOff />
            썸네일 제거
          </Button>
        </div>
      </section>
    </main>
  );
};

export default CreateTopic;
