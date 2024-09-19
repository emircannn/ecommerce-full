/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageIcon, Move, Trash } from "lucide-react"
import { ImageProps } from "./ProductInfo"
import Image from "@/components/Image"
import { ChangeEvent } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";

export interface PhotoProps {
    image: ImageProps;
    images: ImageProps[];
    setImage: React.Dispatch<React.SetStateAction<ImageProps>>
    setImages: React.Dispatch<React.SetStateAction<ImageProps[]>>
    handleSelectFile: (e: ChangeEvent<HTMLInputElement>, setFile: (file: File) => void, setFilePre?: (filePreview: string | ArrayBuffer | null) => void, fileSizeMb?: number) => void
    handleSelectFiles: (e: ChangeEvent<HTMLInputElement>, setFiles: (files: File[]) => void, setFilePreviews?: (filePreviews: (string | ArrayBuffer | null)[]) => void, fileSizeMb?: number) => void
    }

const Photos: React.FC<PhotoProps> = ({
    handleSelectFile,
    handleSelectFiles,
    image,
    images,
    setImage,
    setImages
}) => {

    const handleSingleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleSelectFile(e, (file) => setImage({ data: file, pre: null }), (preview) => setImage((prev) => ({ ...prev, pre: preview })));
    };
  
    const handleMultipleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleSelectFiles(e, (files) => setImages(files.map(file => ({ data: file, pre: null }))), (previews) => setImages(prevImages => prevImages.map((img, index) => ({ ...img, pre: previews[index] }))));
    };

    const handleDeleteImage = (index: number) => {
        if(index === 0 && images.length === 1) {
            setImages([{data: null, pre: null}]);
        } else {
            const updatedImages = images.filter((_, i) => i !== index);
            setImages(updatedImages);
        }
    };

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;
    
        const updatedItems = Array.from(images);
        const [reorderedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, reorderedItem);
    
        setImages(updatedItems);
      };

  return (
    <div className="w-[480px] flex flex-col items-center gap-3">
        <div className="w-full shrink-0 aspect-square border border-thirth rounded-xl overflow-hidden relative flex items-center justify-center">
            {
                image.pre ? (
                    <Image 
                    alt="image" 
                    existSrcSet={false}
                    src={image.pre as string}/>) 
                    : 
                    (<div className="flex flex-col gap-3 items-center justify-center">
                        <ImageIcon size={40}/>
                        <p className="text-sm text-center font-medium">Ana Resim (Bu Alan Zorunludur.)</p>
                    </div>)
            }

            <input 
            accept="image/*" 
            type="file" 
            className="absolute inset-0 opacity-0" onChange={handleSingleFileChange} />
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable-images" direction="horizontal">
                    {(provided) => (
                        <div 
                            className="w-full grid grid-cols-5 gap-3" 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                        >
                            {images?.map((v, i) => (
                                <Draggable key={i} draggableId={i.toString()} index={i}>
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps} 
                                            {...provided.dragHandleProps} 
                                            className="flex flex-col w-full gap-3 hover:bg-lightBg hover:dark:bg-darkPrimaryLight duration-300"
                                        >
                                            <div className="w-full overflow-hidden relative aspect-square border border-thirth rounded-xl flex items-center justify-center">
                                                {v.pre ? (
                                                    <Image 
                                                        alt="image" 
                                                        existSrcSet={false}
                                                        src={v.pre as string}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center">
                                                        <ImageIcon/>
                                                        <p className="text-xs text-center font-medium">Çoklu Seçim</p>
                                                    </div>
                                                )}
                                                <input 
                                                    accept="image/*" 
                                                    type="file" 
                                                    multiple
                                                    className="absolute inset-0 opacity-0" 
                                                    onChange={handleMultipleFilesChange} 
                                                />
                                            </div>
                                            {(i !== 0 || images[0].data !== null || images[0].pre !== null) && (
                                                <div className="flex gap-1">
                                                <button 
                                                    onClick={() => handleDeleteImage(i)}
                                                    className={cn(images.length <= 1 ? 'w-full' : "w-1/2",
                                                        "py-2 bg-gradient-to-r from-red-500 to-red-700 flex items-center text-white justify-center rounded-xl hover:opacity-80 duration-300"
                                                    )}
                                                >
                                                    <Trash size={14}/>
                                                </button>

                                                {
                                                    images.length > 1 && (
                                                        <button className="w-1/2 py-2 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white rounded-xl hover:opacity-80 duration-300">
                                                            <Move size={14}/>
                                                        </button>
                                                    )
                                                }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                        </div>
                    )}
                </Droppable>
            </DragDropContext>
    </div>
  )
}

export default Photos