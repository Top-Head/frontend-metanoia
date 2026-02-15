import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Metanoia Academy</h1>
      <div className="flex items-center gap-2">
        <Button className="bg-primary text-white px-4 py-2 rounded-md">
          <Link href="/auth/login">Go to Login</Link>
        </Button>
        <Button className="bg-primary text-white px-4 py-2 rounded-md">
          <Link href="/auth/register">Go to Register</Link>
        </Button>
      </div>
    </div>
  );
}
