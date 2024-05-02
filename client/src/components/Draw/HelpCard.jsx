import { useEffect, useRef } from "react";
import { urls, shortcuts } from "../../utils/Data/helpCardData";
import HelpButton from "./HelpButton";

const HelpCard = ({ closeHelpCard }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (cardRef.current && !cardRef.current.contains(e.target)) {
                closeHelpCard();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [closeHelpCard]);

    return (
        <div className='absolute z-10 bg-neutral-900 bg-opacity-10 w-full h-[88%] top-[6%] flex justify-center items-center'>
            <div
                ref={cardRef}
                className='bg-[#232329] flex flex-col gap-8 p-10 relative w-3/5 rounded-lg border-[1px] border-neutral-600 transition text-white h-full overflow-scroll overflow-x-hidden'
            >
                <h2 className="text-xl font-semibold">Help</h2>
                <div className="w-full h-2 bg-neutral-600">&nbsp;</div>
                <div className="flex flex-row gap-4">
                    {urls?.map(item => <HelpButton {...item} />)}
                </div>
                <h2 className="text-xl font-semibold">Keyboard shortcuts</h2>
                <div className="grid grid-cols-2 gap-5 w-full">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="w-full">
                            <p className="font-bold">{shortcut.name}</p>
                            <div className="border-2 rounded-lg border-neutral-500 mt-2 max-w-lg">
                                {shortcut.list.map((s) => (
                                    <div key={s.name} className="text-center border-b-2 border-neutral-500 last:border-none text-sm px-3 py-[0.375rem] flex justify-between items-center">
                                        <span className="capitalize">{s.name}</span>
                                        <div className="gap-2 flex">
                                            {s.key.map((k, index) => (
                                                <>
                                                    {k.map(key => (
                                                        <div className="bg-[#4F4D6F] px-2 py-1 rounded-md text-[.625rem]">{key}</div>
                                                    ))}
                                                    {index !== s.key.length - 1 && <span>or</span>}
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HelpCard;