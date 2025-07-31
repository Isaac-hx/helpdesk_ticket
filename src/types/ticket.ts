export type Ticket = {
  ticket_id: number;
  title: string;
  division: string;
  name_user: string;
  ticket_status: string;
  description: string;
  created_at: string;
  updated_at: string;
  profile_id?: number;

  // Relasi ke profiles (optional)
  profiles?: {
    profile_id: number;
    name: string;
  };
}
export type TicketList = {
    data: Ticket[];
    total: number;
    limit: number;
    offset: number;
    total_pages:number;
    current_page:number;
    page:number;
};

