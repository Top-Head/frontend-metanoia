import Header from "@/components/dashboard/Header";
import SidebarDashboard from "@/components/dashboard/sidebar";
import Cards from "@/components/dashboard/Cards";
import Service from "@/components/dashboard/Service";
import Calendar from "@/components/dashboard/Calendar";


export default function Dashboard (){
    return (
        <main className="flex">
          <SidebarDashboard/>
          <div className="flex-1">
            <Header/>
            <div className="ml-8 mt-10">
              <Cards/>
              <Service/>
            </div>
          </div>
            <Calendar/>
        </main>
    )
}