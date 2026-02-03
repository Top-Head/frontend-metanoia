import { FcGoogle } from "react-icons/fc";
import { SiLinkedin } from "react-icons/si";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Google */}
      <button className="flex items-center justify-center gap-3 px-4 py-3 border border-black rounded-lg hover:bg-background-light transition-colors">
        <FcGoogle size={18} />
        <span className="text-sm font-semibold text-black">Google</span>
      </button>

      {/* LinkedIn */}
      <button className="flex items-center justify-center gap-3 px-4 py-3 border border-black rounded-lg hover:bg-background-light transition-colors">
        <SiLinkedin className="text-primary" />
        <span className="text-sm font-semibold text-black">LinkedIn</span>
      </button>
    </div>
  )
}
