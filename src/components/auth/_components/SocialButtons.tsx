import { FcGoogle } from "react-icons/fc";
import { SiLinkedin } from "react-icons/si";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Google */}
      <button className="flex items-center justify-center gap-3 px-4 py-3 border border-background-dark dark:border-background-light rounded-lg hover:bg dark:hover:bg-background-dark transition-colors">
        <FcGoogle size={18} />
        <span className="text-sm font-semibold text-background-dark dark:text-background-light">Google</span>
      </button>

      {/* LinkedIn */}
      <button className="flex items-center justify-center gap-3 px-4 py-3 border border-background-dark dark:border-background-light rounded-lg hover:bg-background-light dark:hover:bg-background-light transition-colors">
        <SiLinkedin className="text-primary" />
        <span className="text-sm font-semibold text-background-dark dark:text-background-light">LinkedIn</span>
      </button>
    </div>
  )
}
