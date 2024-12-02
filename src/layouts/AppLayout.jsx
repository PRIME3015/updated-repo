import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen w-full">
        <Navbar/>
        <Outlet/>

      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made by group 42
      </div>
    </div>
  )
}
export default AppLayout;
