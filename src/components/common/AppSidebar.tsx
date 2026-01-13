import { CLASS_CATEGORY } from "@/constants/category.contstant";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui";

const AppSidebar = () => {
  return (
    <aside className="min-w-60 w-60 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">카테고리</h4>
        <ChevronDown className="mt-1" />
      </div>
      <div className="w-full flex flex-col gap-2">
        {CLASS_CATEGORY.map((menu) => {
          return (
            <Button
              key={menu.id}
              variant={"ghost"}
              className="justify-start text-muted-foreground hover:text-white hover:pl-6 trasition-all duration-500"
            >
              {menu.icon}
              {menu.label}
            </Button>
          );
        })}
      </div>
    </aside>
  );
};

export { AppSidebar };
