import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,

} from "../components/ui/pagination"
import { Eye, User, Building2,ChevronRight,ChevronLeft,Search } from "lucide-react"
import {  useEffect, useState } from "react"
import { getAllTickets } from "../services/ticket"
import type { Ticket } from "../types/ticket"
import formatToLocalDateTime from "../utils/convertTime"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Link } from "react-router"




export default function Home() {
  const [tickets,setTickets] = useState<Ticket[]>()
  const [categoryTicket,setCategoryTicket] = useState("resolve")
  const [totalItem,setTotalItem] = useState(0)
  const [totalPage,setTotalPage] = useState(1)
  const [page,setPage] = useState(1)
  const [search,setSearch] = useState("")

  useEffect(()=>{
    const fetchAllTickets = async ()=>{
        try{
            const response = await getAllTickets("DESC",search,8,0,page,categoryTicket)
            console.log(response)
            setTickets(response.data)
            setTotalPage(response.total_pages)
            setTotalItem(response.total)
        }catch(e){
            console.log(e)
        }
    }
    fetchAllTickets()
  },[categoryTicket,page])

  const handleSearch = async ()=>{
    try{
        const response = await getAllTickets("ASC",search,20000,0,1,categoryTicket)
        setTickets(response.data)
        setTotalItem(response.total_pages)
        setTotalItem(response.total)
    }catch(e){
      console.log(e)
    }

  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            <div className=" sm:w-64">
              <Select  onValueChange={(status)=>{setCategoryTicket(status)}}  defaultValue="resolve">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem className="bg-white" value="progress">In Progress</SelectItem>
                  <SelectItem className="bg-white" value="resolve">Resolved</SelectItem>
                  <SelectItem className="bg-white" value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input onKeyDown={(event)=>{event.key === "Enter"? handleSearch():false}} className="bg-white w-full" onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search user name"/>
              <Button onClick={handleSearch} className="bg-blue-400"><Search/></Button>
            </div>
          </div>
        </section>

        {/* Work Items Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{categoryTicket[0].toUpperCase()}{categoryTicket.slice(1,)} work category</h2>
            <span className="text-sm text-gray-500">{totalItem} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {
              totalItem === 0 ? <h1 className="text-md">No record found!!</h1> : tickets?.map((item) => (
              <Card
                key={item.ticket_id}
                className="w-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-blue-400"
              >
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">{item.title}</CardTitle>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {item.ticket_id}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <CardDescription className="text-base font-medium text-gray-700 flex items-center gap-2">
                      <User size={18} className="text-gray-500" />
                      {item.name_user}
                    </CardDescription>
                    <CardDescription className="text-base font-medium text-gray-700 flex items-center gap-2">
                      <Building2 size={18} className="text-gray-500" />
                      {item.division}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 font-medium">{formatToLocalDateTime(item.created_at)}</p>
                  <button
                    className="text-emerald-600 hover:text-emerald-700 transition-colors p-1 rounded-full hover:bg-emerald-50"
                    aria-label={`View details for ${item.title}`}
                  >
                    <Link to={`/detail-work/${item.ticket_id}`}>
                        <Eye size={20}  />

                    </Link>
                  </button>
                </CardFooter>
              </Card>
            ))
            }

          </div>
        </section>

        {/* Pagination */}
        <section className="">
          <Pagination className=" flex justify-end items-center">
            <div>
              <p className="text-xs text-slate-800">Page {page} of {totalPage} - {8} items</p>
            </div>
            <PaginationContent>
              <PaginationItem onClick={()=>{setPage(page <= 1 ? 1: page-1 )}}>
                <ChevronLeft className={`${page <= 1 ? 'text-slate-500 ':"text-slate-800"}`}/>
              </PaginationItem>
              <PaginationItem>
                <div className="p-1 text-xs rounded-md border-1">
                  {page}
                </div>
              </PaginationItem>
              <PaginationItem onClick={()=>{setPage(page>=totalPage ? totalPage :page+1 )}}>
                <ChevronRight className={` ${page===totalPage ? 'text-slate-500 ':"text-slate-800"}`}/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </div>
    </div>
  )
}