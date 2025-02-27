import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import MobileMenu from "./MobileMenu";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    // <div className="h-20  md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative z-50 w-full">

    <div className="h-[70px] md:h-[120px]  max-w-[1400px] px-[15px]  relative z-50 w-full mx-auto">

      {/* MOBILE */}
      {/* <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">BDN</div>
        </Link>
        <Menu />
      </div> */}
  
        <MobileMenu/>


      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-[5rem]">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/bdn-logo.png" alt="" width={50} height={50} />
            <div className="text-2xl tracking-wide">BDN Inc.</div>
          </Link>
          <div className="hidden xl:flex gap-4 font-quicksand">
            <Link href="/">Home</Link>
            <Link href="/list">Shop</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-end gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;