import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,

} from "../components/ui/pagination"
import { Eye, User, Building2,ChevronRight,ChevronLeft,Search } from "lucide-react"
import {  useEffect, useState } from "react"
import { createTicket, getAllTickets } from "../services/ticket"
import type { Ticket } from "../types/ticket"
import formatToLocalDateTime from "../utils/convertTime"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Link, useNavigate } from "react-router"
import {
  Dialog,
  DialogContent,
  
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "../components/ui/dialog"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuItem
 } from "../components/ui/dropdown-menu"
import { getCookie } from "../helper/getCookie"
import { Avatar,AvatarFallback,AvatarImage } from "../components/ui/avatar"
import { logout } from "../services/user"


export default function Admin() {
  const [tickets,setTickets] = useState<Ticket[]>()
  const [formData,setFormData] = useState({
    title:"",
    description:"",
   name_user:"",
   division :"",
  })
  const [categoryTicket,setCategoryTicket] = useState("progress")
  const [totalItem,setTotalItem] = useState(0)
  const [totalPage,setTotalPage] = useState(1)
  const [page,setPage] = useState(1)
  const [search,setSearch] = useState("")
  const [email,setEmail] = useState("")
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchAllTickets = async ()=>{
        try{
            const responseTicket = await getAllTickets("DESC",search,8,0,page,categoryTicket)
            const emailUser = getCookie("email")
            if (emailUser === null){
                alert("credential invalid!!")
                navigate("/login-admin")
                return;
            }
            setEmail(emailUser)
            setTickets(responseTicket.data)
            setTotalPage(responseTicket.total_pages)
            setTotalItem(responseTicket.total)
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
const handleCreateTicket = async () => {
  try {
    // Validasi formData kosong
    if (!formData || !formData.title || !formData.name_user || !formData.description || !formData.division) {
      alert("Please fill in all form fields");
      return;
    }

    // Ambil user_id dari cookie
    const user_id = getCookie("user_id");
    console.log(user_id)
    if (!user_id) {
      alert("User not logged in. Redirecting to login...");
      navigate("/login-admin");
      return;
    }
    
    // Kirim ke API createTicket
    const response = await createTicket(
      user_id,
      formData.title,
      formData.name_user,
      formData.description,
      formData.division
    );

    console.log("Ticket created:", response);
    alert("Ticket successfully created!");
    window.location.reload()
    // Optional: reset form or redirect
    // navigate("/tickets"); 
  } catch (error: any) {
    console.error("Create ticket failed:", error);
    alert(error.message || "An error occurred while creating the ticket.");
  }
};
  const handleLogout = async()=>{
    try{
        const response = await logout()
        navigate("/login-admin")
        console.log(response)
    }catch(e){
        console.log(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }))
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            <div className=" sm:w-64">
              <Select  onValueChange={(status)=>{setCategoryTicket(status)}}  defaultValue="progress">
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

            <div>
                <DropdownMenu>
  <DropdownMenuTrigger>      <Avatar>
        <AvatarImage src="https://www.freeiconspng.com/thumbs/profile-icon-png/account-profile-user-icon--icon-search-engine-10.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>{email}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
            </div>

          </div>

                      <div className=" my-2">
        <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button >Create ticket</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create ticket</DialogTitle>

          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input onChange={handleChange} id="title" name="title" placeholder="Input title ticket" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea onChange={handleChange} id="description" name="description" placeholder="Input description" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name_user">Name User</Label>
              <Input onChange={handleChange} id="name_user" name="name_user" placeholder="Input name user" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="division">Division</Label>
              <Input onChange={handleChange} id="division" name="division" placeholder="Input divison user" />
            </div>
            <div>

            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateTicket} type="submit">Crate ticket</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
            </div>
                        <div className="flex gap-2">
              <Input onKeyDown={(event)=>{event.key === "Enter"? handleSearch():false}} className="bg-white max-w-md" onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search user name"/>
              <Button onClick={handleSearch} className="bg-blue-400"><Search/></Button>
            </div>

        </section>

        {/* Work Items Grid */}
        <section className="mb-8">
          <div className="flex flex-col  justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{`Hello IT,`}</h2>
            <h3 className="text-2xl font-bold text-gray-900">{categoryTicket[0].toUpperCase()}{categoryTicket.slice(1,)} work category</h3>
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
                    <Link to={`/detail-work-admin/${item.ticket_id}`}>
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