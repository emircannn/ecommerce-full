

import React, { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Button } from "../ui/button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryActionLabel?: string;
    secondaryAction?: () => void;
}

const Modal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSubmit,
    actionLabel,
    body,
    disabled,
    footer,
    secondaryAction,
    secondaryActionLabel,
    title
}) => {

    const [showModal, setShowModal] = useState(isOpen)

    useEffect(() => {
        setShowModal(isOpen)
    }, [isOpen])
    
    const handleClose = useCallback(() => {
        if(disabled) return

        setShowModal(false)
        setTimeout(() => {
            onClose()
        }, 300)
    },[disabled, onClose]);
    
    const handleSubmit = useCallback(() => {
        if(disabled) return

        onSubmit()
    }, [disabled, onSubmit]);

    const handleSecondaryAction = useCallback(() => {
        if(disabled || !secondaryAction) return

        secondaryAction()
    }, [disabled, secondaryAction]);

    if(!isOpen) {
        return null
    }

  return (
    <>
    <div className="justify-center hideScrollRes items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none bg-neutral-800/70">
        <div className="relative w-full md:w-4/6 lg:w-3/6 my-6 mx-auto h-full lg:h-auto md:h-auto">
            {/* Icerik */}
            <div className={`
            transition duration-300 h-full 
            ${showModal ? 'translate-y-0' : 'translate-y-full'}
            ${showModal ? 'opacity-100' : 'opacity-0'}
            `}>
                <div className="transition h-full lg:h-auto md:h-auto border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/* Baslik */}
                    <div className="flex items-center justify-center p-6 relative border-b">
                        <p className="text-sm 876:text-lg font-semibold">
                            {title}
                        </p>
                        <button onClick={handleClose} className="p-1 border-0 hover:opacity-70 transition absolute right-4 876:right-9">
                            <IoMdClose size={18}/>
                        </button>
                    </div>
                    {/* Body */}
                    <div className="relative p-6 flex-auto">
                        {body}
                    </div>
                    {/* Footer */}
                    <div className="flex flex-col gap-2 p-6">
                        <div className="flex flex-row items-center gap-4 w-full">
                            {
                                secondaryAction && secondaryActionLabel && (
                                    <Button
                                        disabled={disabled}
                                        onClick={handleSecondaryAction}
                                        className="w-full"
                                        variant={'secondary'}
                                    >{secondaryActionLabel}</Button>
                                )
                            }
                            <Button
                                disabled={disabled}
                                onClick={handleSubmit}
                                className="w-full"
                            >{actionLabel}</Button>
                        </div>
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Modal