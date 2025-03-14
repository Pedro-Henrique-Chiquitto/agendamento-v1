import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Home, LogOut } from "lucide-react";

export function SidebarNav() {
  const { logoutMutation } = useAuth();

  return (
    <div className="w-64 bg-sidebar border-r min-h-screen p-4 space-y-4">
      <div className="font-semibold text-xl mb-8">School Manager</div>
      
      <nav className="space-y-2">
        <Link href="/">
          <a className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </a>
        </Link>
        <Link href="/calendar">
          <a className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </a>
        </Link>
      </nav>

      <div className="mt-auto pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
