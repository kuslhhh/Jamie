"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchSongPopup from "../SearchSongPopup";
import Userprofile from "../Userprofile";

function Header() {
  const router = useRouter();
  return (
    <header className="border w-6/12 p-3 rounded-xl px-5 z-40 border-[#49454F] flex items-center justify-between ">
      <div onClick={() => router.refresh()} className=" cursor-pointer">
        <Image src={"/logo.svg"} alt="logo" height={50} width={50} />
      </div>

      <SearchSongPopup />
      <Userprofile />
    </header>
  );
}

export default Header;
