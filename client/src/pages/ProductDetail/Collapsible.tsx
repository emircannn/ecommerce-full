
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Collapse from "@mui/material/Collapse";
import { cn } from "@/lib/utils";

interface Props {
    title: string;
    lastComp?: boolean;
    collapsesibleSide?: JSX.Element;
}

const Collapsible: React.FC<Props> = ({
    title='',
    lastComp=false,
    collapsesibleSide
}) => {

    const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
        <div className={cn(`p-5 876:p-8 flex items-center justify-between`, !lastComp && 'border-b border-border')}>
            <p className="text-xs 876:text-sm font-semibold text-primary">{title}</p>

            <button onClick={() => setIsOpen(!isOpen)}>
                <IoIosArrowDown size={24} className={cn(`text-third-dark duration-300`, isOpen && 'rotate-180')}/>
            </button>
        </div>

        <Collapse in={isOpen}>
            <div className={cn(`p-5 876:p-8`, lastComp ? 'border-t' : 'border-b border-border')}>
                {collapsesibleSide}
            </div>
        </Collapse>
    </div>
  )
}

export default Collapsible