import { Image } from "lucide-react";
import { useRef } from "react";
import { Button, Input } from "../ui";

interface Props {
  file: File | string | null;
  onChange: (file: File | string | null) => void;
}

const AppFileUpload = ({ file, onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 파일변경감지
  const handleChanageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    onChange(event.target.files?.[0] ?? null);
    event.target.value = ""; // 동일 파일 선택일 불가능할 수 있으므로 event.target.value를 초기화
  };

  // 이미지 미리보기
  const handleRenderPreview = () => {
    if (typeof file === "string") {
      return <img src={file} alt="@THUMBNAIL" className="w-full aspect-video rounded-lg object-cover border" />;
    } else if (file instanceof File) {
      return <img src={URL.createObjectURL(file)} alt="@THUMBNAIL" className="w-full aspect-video rounded-lg object-cover border" />;
    }
    // 썸네일 설정되지 않은 경우 기본 이미지 표시
    return (
      <div className="w-full flex items-center justify-center aspect-video bg-card rounded-lg">
        <Button size={"icon"} variant={"ghost"} onClick={() => fileInputRef.current?.click()}>
          <Image />
        </Button>
      </div>
    );
  };
  return (
    <>
      {handleRenderPreview()}
      <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleChanageFile} className="hidden" />
    </>
  );
};

export { AppFileUpload };
