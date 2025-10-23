import { ToolButton } from "@/app/lib/definations";

export default function ToolBarBtn(btnData: ToolButton) {
  return (
    <button className="flex justify-center items-center px-4 py-2 cursor-pointer opacity-80 ">
        {btnData.icon && <btnData.icon className="w-7 h-5" />}
    </button>
  );
}
