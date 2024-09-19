import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";


const PanelLayout = () => {
  return (
    <div className="h-screen w-screen p-5 overflow-hidden">
      <Header/>
      <section className="flex h-[calc(100%-90px)] gap-5">
        <Sidebar/>
        <main className="flex-1 h-full overflow-hidden">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default PanelLayout;
