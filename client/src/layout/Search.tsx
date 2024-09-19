
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

const Search = () => {

  const [open, setOpen] = useState(false)

  return (
    <>
    <div className="mx-auto w-[300px] h-10 rounded-full bg-third px-3 flex items-center gap-2 max-lg:hidden">
        <CiSearch size={22} className="text-neutral-600"/>
        <input 
        name="search"
        id="search"
        placeholder="Ara..."
        className="bg-transparent w-full h-full focus:ring-0 border-0 focus:outline-none text-sm font-medium placeholder:text-neutral-400"
        type="text" />
    </div>

    <div className="lg:hidden flex justify-end ">
      <button 
      onClick={() => setOpen(!open)}
      className="p-3 rounded-full bg-third shrink-0">
      <CiSearch size={24} className="text-neutral-600"/>
      </button>

      <div className={`absolute top-0 left-0 w-full h-[40px] bg-third z-[999] animate-search ${!open && 'hidden' } flex items-center gap-2 px-3`}>
        <CiSearch size={22} className="text-neutral-600"/>
        <input 
        name="search"
        id="search"
        placeholder="Ara..."
        className="bg-transparent w-full h-full focus:ring-0 border-0 focus:outline-none text-sm font-medium placeholder:text-neutral-400"
        type="text" />
      </div>

      <div 
      onClick={() => setOpen(!open)}
      className={`fixed top-0 left-0 flex bg-black/50 z-[998] w-full h-full ${!open && 'hidden' } animate-fade`}/>
    </div>
    </>
  )
}

export default Search