import { useState } from "react";
import { IoIosEye, IoIosEyeOff  } from "react-icons/io";

interface Props {
    isTextArea?: boolean;
    name?: string;
    id?: string;
    readonly?: boolean;
    disabled?: boolean;
    value: string;
    onChange: (value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    width?: string;
    height?: string;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
    isPassword?: boolean;
    required?: boolean;
}

const Input: React.FC<Props> = ({
    isTextArea=false,
    name,
    onChange,
    value,
    disabled=false,
    id,
    readonly=false,
    type='text',
    placeholder,
    width='100%',
    height= isTextArea ? '200px' : '45px',
    maxLength,
    minLength,
    max,
    min,
    isPassword,
    required
}) => {

    const [showPassword, setShowPassword] = useState(false)

  return (
    !isTextArea ? 
        <div 
        style={{width, height}}
        className="relative select-none">
            <input 
            type={isPassword ? showPassword ? 'text' : "password" : type}
            value={value}
            disabled={disabled}
            readOnly={readonly}
            placeholder={placeholder}
            onChange={onChange}
            maxLength={maxLength}
            minLength={minLength}
            max={max}
            min={min}
            name={name}
            id={id}
            required={required}
            style={{width, height}}
            className="outline-none focus:outline-none bg-third rounded-xl border border-third-dark px-3 
            text-sm font-medium placeholder:text-third-dark disabled:opacity-75 disabled:cursor-not-allowed focus:border-secondary"
            />

            {isPassword && (
            <div className="absolute right-0 top-0 h-full p-2 flex items-center">
                {
                    showPassword ? 
                    (
                    <IoIosEyeOff 
                        size={24} 
                        className="cursor-pointer"
                        onClick={() => setShowPassword(false)}/>
                    )
                    :
                    (
                    <IoIosEye 
                        size={24} 
                        className="cursor-pointer"
                        onClick={() => setShowPassword(true)}/>
                    ) 
                }
            </div>
        )}
        </div>
        :
        <div
        className="relative"
        style={{width, height}}
        >
            <textarea
            value={value}
            disabled={disabled}
            readOnly={readonly}
            placeholder={placeholder}
            onChange={onChange}
            name={name}
            id={id}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            style={{width, height}}
            className="outline-none focus:outline-none bg-third rounded-xl border border-third-dark p-3 resize-none
            text-sm font-medium placeholder:text-third-dark disabled:opacity-75 disabled:cursor-not-allowed focus:border-secondary"
            />

            {maxLength && (
                <span className="absolute bottom-2 right-2 text-xs font-semibold text-third-dark">
                    {value.length}/{maxLength}
                </span>
            )}
        </div>
  )
}

export default Input