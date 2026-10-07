import Header from "@/components/Header";
import Profile from "@/components/message/Profile";
import Sidebar from "@/components/message/Sidebar";
import MessageThread from "@/components/message/message";

export default function Messages() {
  return (
    <section className="flex h-dvh flex-col overflow-hidden bg-panel">
      <Header forceSolid search />
      <main className="flex min-h-0 flex-1 pt-19">
        <Sidebar />
        <MessageThread />
        <Profile />
      </main>
    </section>
  );
}