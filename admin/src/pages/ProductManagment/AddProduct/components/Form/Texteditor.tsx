import { SetStateAction } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


interface TextEditorProps {
    desc: string;
    setDesc: React.Dispatch<React.SetStateAction<string>>;
  }
  
  const TextEditor: React.FC<TextEditorProps> = ({ desc, setDesc }) => {

    const handleTextChange = (value: SetStateAction<string>) => {
        setDesc(value);
      };

      const fontSizeOptions = ['small', false, 'large', 'huge'];

  return (
    <div className="w-full border-none">
        <ReactQuill
        value={desc}
        onChange={handleTextChange}
        placeholder="Metin girin..."
        theme="snow"
        modules={{
        toolbar: [
            ['bold', 'italic', 'underline'],                   
            [{ 'size': fontSizeOptions }],
            [{ 'color': [] }, { 'background': [] }],  
            [{ 'align': [] }],
            ['image'],
        ],
        }}
/>
    </div>
  )
}

export default TextEditor