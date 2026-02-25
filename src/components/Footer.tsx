export default function Footer() {
    return (
       
      <footer className="bg-white border-t border-[#e7ecf3] py-10 px-6 md:px-10 mt-12">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-[#136dec]">
          <div className="size-5">
            <svg fill="currentColor" viewBox="0 0 48 48">
              <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"></path>
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight text-[#0d131b]">Metanoia Academy</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs text-[#4c6c9a] font-medium">
          <a className="hover:text-[#136dec] transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-[#136dec] transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-[#136dec] transition-colors" href="#">Help Center</a>
          <a className="hover:text-[#136dec] transition-colors" href="#">Contact Support</a>
        </div>
        
        <p className="text-[10px] text-[#4c6c9a]">© 2024 Metanoia Academy Inc.</p>
      </div>
    </footer>
    );
  }