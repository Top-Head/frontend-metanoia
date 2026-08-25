import Header from "@/components/message/Header"
import Profile from "@/components/message/Profile"
import Sidebar from "@/components/message/Sidebar"
import MessageType from "@/components/message/message"

export default function Messages (){
    return (
        <section className=" bg-white">
            <Header/>
            <main className="flex">

            <Sidebar/>
            <MessageType />
            <Profile/>
            </main>
        </section>
    )
}