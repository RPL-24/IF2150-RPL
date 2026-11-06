import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SideBar } from "./SideBar";
import type { Role } from "@/types/role";

export function Header({ role }: { role: Role }) {
  return (
    <header className="relative flex h-[133px] items-center justify-between bg-[#272C5B] px-[50px] text-white">
      <SideBar role={role} />

      <img
        src="/logoPutih.svg"
        alt="APATIS"
        className="absolute left-1/2 h-[67px] w-auto -translate-x-1/2"
      />

      <div className="flex items-center gap-8">
        <img src="/icon/Notif.svg" alt="Notifikasi" className="h-11 w-auto" />
        <Avatar className="size-[77px]">
          <AvatarImage src="" alt="Profil" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}