import { useAuth } from "@/hooks/use-auth";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SchoolForm } from "@/components/school/school-form";
import { useQuery } from "@tanstack/react-query";
import { School } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();
  const { data: schools } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your schools and schedule</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New School</CardTitle>
              </CardHeader>
              <CardContent>
                <SchoolForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools?.map((school) => (
                    <div key={school.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{school.name}</h3>
                      <p className="text-sm text-muted-foreground">{school.address}</p>
                      <p className="text-sm text-muted-foreground">{school.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
