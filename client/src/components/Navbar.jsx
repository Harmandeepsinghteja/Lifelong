import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { buttonVariants } from "@/components/ui/button";
import UserIconDropdown from "./UserIconWithDropDown";

export default function Navbar() {
  return (
    <nav className="bg-zinc-900  flex flex-row justify-between px-6 ">
      <Link
        to="/"
        className="flex text-2xl xl:text-6xl font-bold  items-center py-5 px-2 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
      >
        Lifelong
      </Link>
      <div className="RightSideWrapper self-center items-center flex flex-row gap-6 ">
        <Link
          className="  text-lg xl:text-3xl  space-x-1 mr-4 text-zinc-200 hover:text-zinc-600 transition  ease-in-out"
          to="/about"
        >
          About
        </Link>

        <UserIconDropdown username={"Jae"} email={"jae.kang1@ucalgary.ca"} />
      </div>
    </nav>
  );
}
