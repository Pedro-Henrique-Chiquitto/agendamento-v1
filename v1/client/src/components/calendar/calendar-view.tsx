import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Event, School, insertEventSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface InsertEvent {
  title: string;
  description: string;
  start: string;
  end: string;
  schoolId: number;
  userId: number; // Added userId
}

interface CalendarEvent extends Event {
  start: Date;
  end: Date;
}

interface User {
  id: number;
  name: string;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  events: Event[];
  schools: School[];
  users: User[];
}

export function CalendarView({ events, schools, users }: CalendarViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      schoolId: schools[0]?.id,
      userId: 1, // Default userId -  needs proper handling in a real app
    },
  });

  const eventMutation = useMutation({
    mutationFn: async (data: InsertEvent) => {
      const res = await apiRequest("POST", "/api/events", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsOpen(false);
      form.reset();
      toast({
        title: "Evento criado",
        description: "O evento foi adicionado ao seu calendário",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calendarEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsOpen(true)}>Adicionar Evento</Button>
      </div>

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={["month", "week", "day"]}
        defaultView="week"
        onSelectEvent={handleSelectEvent}
      />

      {/* Modal de Criação de Evento */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => eventMutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma escola" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem
                            key={school.id}
                            value={school.id.toString()}
                          >
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={eventMutation.isPending}>
                Criar Evento
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Evento */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEvent?.description && (
              <div>
                <h4 className="font-medium mb-1">Descrição</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
            )}
            <div>
              <h4 className="font-medium mb-1">Período</h4>
              <p className="text-sm text-muted-foreground">
                De: {selectedEvent && format(new Date(selectedEvent.start), "dd/MM/yyyy HH:mm")}
                <br />
                Até: {selectedEvent && format(new Date(selectedEvent.end), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Escola</h4>
              <p className="text-sm text-muted-foreground">
                {schools.find(s => s.id === selectedEvent?.schoolId)?.name}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Criado por</h4>
              <p className="text-sm text-muted-foreground">
                {users.find(u => u.id === selectedEvent?.userId)?.name}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}