import { toolBarBtns } from "@/app/lib/constants";
import ToolBarBtn from "./toolButton";

export default function ToolBar() {
  return (
    <div className="bg-neutral-800 absolute top-5  px-2 py-1 rounded-md z-2">
      <div className='flex justify-between items-center divide-x divide divide-neutral-700'>
        <div className='flex justify-center items-center gap-1 pl-1'>
          {toolBarBtns.map((btnData) => <ToolBarBtn {...btnData} key={btnData.slug} />)}
        </div>
      </div>
    </div>
  );
}
