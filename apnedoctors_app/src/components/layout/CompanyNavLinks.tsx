
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CompanyNavLinks = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
        Company
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/about" className="cursor-pointer">About Us</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/careers" className="cursor-pointer">Careers</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/press" className="cursor-pointer">Press</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/blog" className="cursor-pointer">Blog</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompanyNavLinks;
