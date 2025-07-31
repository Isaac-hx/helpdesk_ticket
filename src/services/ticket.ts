import { createClient } from "@supabase/supabase-js";
import type { Ticket, TicketList } from "../types/ticket";
import { PostgrestError } from "@supabase/supabase-js"; // pastikan ini diimport
import {  generateCustomUuid } from "custom-uuid";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

async function getAllTickets(
  order_by: "ASC" | "DESC",
  search: string,
  limit = 8,
  offset = 0,
  page = 1,
  status = "resolve"
): Promise<TicketList> {
    offset = (page-1)*limit

  const { data, error, count } = await supabase
    .from("tickets")
    .select("*", { count: "exact" })
    .ilike("name_user", `%${search}%`)
    .order("created_at", { ascending: order_by === "ASC" })
    .range(offset, offset+limit-1)
    .eq("ticket_status",status);

  if (error) {
    const message = (error as PostgrestError).message;
    console.error("Error fetching tickets:", message);

    return { data: [], total: 0, limit, offset,current_page:1,total_pages:1,page:page };
  }

    const totalItems = count ?? 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalItems / limit);
  return {
    data: data ?? [],
    total: count ?? 0,
    limit,
    offset,
    page:page,
    total_pages:totalPages,
    current_page:currentPage
  };
}



async function getTicketById(id: number): Promise<Ticket> {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      ticket_id,
      title,
      division,
      name_user,
      ticket_status,
      description,
      created_at,
      updated_at,
      profile_id,
      profiles (
        profile_id,
        name
      )
    `)
    .eq("ticket_id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching ticket:", error?.message);
    throw error;
  }

  const ticket: Ticket = {
    ticket_id: data.ticket_id,
    title: data.title,
    division: data.division,
    name_user: data.name_user,
    ticket_status: data.ticket_status,
    description: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at,
    profile_id: data.profile_id,
    profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
  };

  return ticket;
}
async function updateStatusTicket(id: number, ticket_status: string) {
  try {
    console.log("Updating ticket_id:", id, "to status:", ticket_status);

    const { data, error } = await supabase
      .from("tickets")
      .update({
        ticket_status,
        updated_at: new Date().toISOString(),
      })
      .eq("ticket_id", id)
      .select();

    if (error) {
      console.error("Error updating ticket:", error.message);
      throw error;
    }

    console.log("Updated ticket data:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
}

async function getAllTicketByUserId(
  user_id: string,
  order_by: "ASC" | "DESC",
  search: string,
  limit = 8,
  offset = 0,
  page = 1,
  status = "progress"

) {
   const { data, error, count } = await supabase
    .from("tickets")
    .select(
      `
      ticket_id,
      title,
      division,
      name_user,
      ticket_status,
      description,
      created_at,
      updated_at,
      profile_id,
      profiles (
        profile_id,
        name
      )`,
      { count: "exact" }
    )
    .ilike("name_user", `%${search}%`)
    .eq("profile_id", user_id)
    .eq("ticket_status", status)
    .order("created_at", { ascending: order_by === "ASC" })
    .range(offset, offset + limit - 1);



  if (error) {
    const message = (error as PostgrestError).message;
    console.error("Error fetching tickets:", message);

    return { data: [], total: 0, limit, offset, current_page: 1, total_pages: 1, page: page };
  }

  const totalItems = count ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    data: data ?? [],
    total: count ?? 0,
    limit,
    offset,
    page: page,
    total_pages: totalPages,
    current_page: currentPage
  };
}

async function createTicket(user_id:string,title:string,name_user:string,description:string,division:string) {

  const { data: profile, error: errorProfile } = await supabase.from("profiles").select("*").eq("user_id",user_id).single()
  if (errorProfile){
    console.error(errorProfile)
    throw errorProfile}

const { data, error } = await supabase.from('tickets').insert([
  {
    title:title,
    name_user:name_user,
    profile_id:profile.profile_id,
    ticket_status:"progress",
    description:description,
    division:division,
    created_at:new Date().toISOString(),
    updated_at:new Date().toISOString(),

  }
   
])



if (error) {
  console.error("Error insert ticket:", error.message);
  throw error;
}

return data;
}

export {getAllTickets,getTicketById,updateStatusTicket,createTicket,getAllTicketByUserId}