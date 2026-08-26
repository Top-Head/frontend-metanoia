import Header from "@/components/message/Header"
import Profile from "@/components/message/Profile"
import Sidebar from "@/components/message/Sidebar"
import MessageType from "@/components/message/message"

export default function Messages (){
    return (
        <section className="h-dvh flex flex-col bg-white overflow-hidden">
            <Header/>
            <main className="flex flex-1 min-h-0">
                <Sidebar/>
                <MessageType />
                <Profile/>
            </main>
        </section>
    )
}