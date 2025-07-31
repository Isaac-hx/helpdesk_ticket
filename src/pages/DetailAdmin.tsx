import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"
import { Calendar, User, FileText, Hash, CheckCircle, Clock, ArrowLeft, Edit, AlertCircle } from "lucide-react"

import { Link, useParams } from "react-router"
import { getTicketById, updateStatusTicket } from "../services/ticket"
import type{ Ticket } from "../types/ticket"
import formatToLocalDateTime from "../utils/convertTime"





const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case "resolve":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}


export default function DetailAdmin() {
  const {ticket_id} = useParams()
  const [ticketDetail, setTicketDetail] = useState<Ticket>()
  useEffect(()=>{


    const fetchTicketById = async()=>{


      try{
        const response = await getTicketById(parseInt(ticket_id ?? "",10))
        setTicketDetail(response)
      }
      catch(e){
        console.log(e)
      }
    }
    fetchTicketById()
  },[])




  const handleStatusTicket = async (id:number,status:string) =>{
    try{
      const response = await updateStatusTicket(id,status)
      alert(`Success update status ${response}`)
      window.location.href = "/"

    }catch(e){
      alert(`Error occured : ${e}`)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}


      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Link to={"/dashboard-helpdesk"} className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back
              </Link>
        <Card className="w-full shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 font-mono">
                    {ticketDetail?.ticket_id}
                  </Badge>
 
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{ticketDetail?.name_user}</CardTitle>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(ticketDetail?.ticket_status)} variant="outline">
                  {ticketDetail?.ticket_status === "resolve" ? (
                    <CheckCircle size={14} className="mr-1" />
                  ) : ticketDetail?.ticket_status === "progress" ? (
                    <Clock size={14} className="mr-1" />
                  ) : (
                    <AlertCircle size={14} className="mr-1" />
                  )}
                  {ticketDetail?.ticket_status}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Status Update Alert for In Progress items */}
            {ticketDetail?.ticket_status === "progress" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="text-blue-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">Work in Progress</h3>
                    <p className="text-blue-800 text-sm mt-1">
                      This work item is currently being worked on. Once completed, you can mark it as resolved using the
                      button above.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Work Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Hash size={16} />
                  Ticket ID
                </div>
                <p className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{ticketDetail?.ticket_id}</p>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <User size={16} />
                  Assigned To
                </div>
                <p className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{ticketDetail?.profiles?.name}</p>
              </div>

              {/* Order Created */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Calendar size={16} />
                  Order Created
                </div>
                <p className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {ticketDetail?.created_at ? formatToLocalDateTime(ticketDetail.created_at) : "Not resolved yet"}
                </p>
              </div>

              {/* Resolved At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Clock size={16} />
                  Resolved At
                </div>
                <p className="text-lg text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {ticketDetail?.updated_at ? formatToLocalDateTime(ticketDetail.updated_at) : "Not resolved yet"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Title Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText size={20} />
                Work Title
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-lg text-gray-900 leading-relaxed">{ticketDetail?.title}</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText size={20} />
                Description
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{ticketDetail?.description}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Department:</span>
                  <p className="text-gray-900 font-medium">{ticketDetail?.division}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Name user:</span>
                  <p className="text-gray-900 font-medium">
                   {ticketDetail?.name_user}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
  
              <Link className="flex items-center w-full  border-2  p-1 rounded-md justify-center flex-1 bg-transparent" to={`/dashboard-helpdesk`}>
                <ArrowLeft size={16} className="mr-2" />
                {"Back to dashboard"}
              </Link>
  {ticketDetail?.ticket_status === "progress" ? (
  <Button
    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
    onClick={() => handleStatusTicket(ticketDetail.ticket_id, "resolve")}
  >
    <CheckCircle size={16} className="mr-2" />
    Mark as Resolved
  </Button>
) : ticketDetail?.ticket_status === "resolve" ? (
  <Button
    variant="destructive"
    className="flex-1"
    onClick={()=>{handleStatusTicket(ticketDetail.ticket_id,"closed")}}
  >
    <Edit size={16} className="mr-2" />
    Mark as Closed
  </Button>
) : null}

            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}