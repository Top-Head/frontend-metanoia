import Header from "@/components/dashboard/Header";
import SidebarDashboard from "@/components/dashboard/sidebar";
import Cards from "@/components/dashboard/Cards";


export default function Dashboard (){
    return (
        <main className="flex">
          <SidebarDashboard/>
          <div className="flex-1">
            <Header/>
            <div className="ml-8 mt-10">
              <Cards/>
            </div>
          </div>
        </main>
    )
}