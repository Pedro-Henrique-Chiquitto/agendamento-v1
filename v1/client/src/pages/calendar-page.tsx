import { useQuery } from "@tanstack/react-query";
import { Event, School, User } from "@shared/schema";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: schools, isLoading: schoolsLoading } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const isLoading = eventsLoading || schoolsLoading || usersLoading;

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
            <p className="text-muted-foreground">Gerencie sua agenda e eventos</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sua Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[600px] w-full" />
                </div>
              ) : (
                <CalendarView 
                  events={events || []} 
                  schools={schools || []} 
                  users={users || []}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}