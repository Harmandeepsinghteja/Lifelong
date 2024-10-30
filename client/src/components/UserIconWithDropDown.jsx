import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, MessageSquareX, LogOut } from "lucide-react";
import { useSharedState } from "../MyContext";

export default function UserIconDropdown({ username }) {
  const { isLoggedIn, setIsLoggedIn } = useSharedState();
  const [isOpen, setIsOpen] = useState(false);

  const firstInitial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (!isLoggedIn) {
      localStorage.removeItem("token");
      window.location.reload(true); // Refreshes the current page, same as clicking the refresh button in your browser
    }
  };

  const handleUnmatch = () => {
    if (window.confirm("Are you sure you want to unmatch? You will never be able to see your penpal once you unmatch.")) {

    } else { }

  };

  const navigate = useNavigate();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full bg-zinc-700 hover:bg-zinc-600 focus:ring-2 focus:ring-zinc-500"
        >
          <span className="text-xl font-semibold text-zinc-100">
            {firstInitial}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-800 text-zinc-100 border-zinc-700">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-2">
            <p className="text-xl font-medium leading-none">{username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem className="focus:bg-zinc-700 focus:text-zinc-100">
          <User className="mr-2 h-4 w-4" />
          <span onClick={() => navigate("/bio")}>View/Update Bio</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-zinc-700 focus:text-zinc-100">
          <MessageSquareX className="mr-2 h-4 w-4" />
          <span onClick={handleUnmatch}>Unmatch</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem className="focus:bg-zinc-700 focus:text-zinc-100">
          <LogOut className="mr-2 h-4 w-4" />
          <span onClick={handleLogout}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
