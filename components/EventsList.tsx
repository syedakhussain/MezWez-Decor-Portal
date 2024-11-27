'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CreateInvoiceDialog } from './CreateInvoiceDialog'
import { EditEventDialog } from './EditEventDialog'

interface Event {
  id: number
  date: string
  name: string
  type: string
  expenses: number
  revenue: number
  profit: number
}

interface EventsListProps {
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

export function EventsList({ events, setEvents }: EventsListProps) {
  // Remove the local events state
  // const [events, setEvents] = useState<Event[]>([...])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [showEditEvent, setShowEditEvent] = useState(false)

  const handleCreateInvoice = (event: Event) => {
    setSelectedEvent(event)
    setShowCreateInvoice(true)
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowEditEvent(true)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-indigo-600 text-white text-sm">
            <th className="p-3 text-left">DATE</th>
            <th className="p-3 text-left">EVENT NAME</th>
            <th className="p-3 text-left">TYPE</th>
            <th className="p-3 text-right">EXPENSES</th>
            <th className="p-3 text-right">REVENUE</th>
            <th className="p-3 text-right">PROFIT</th>
            <th className="p-3 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b">
              <td className="p-3">{event.date}</td>
              <td className="p-3">{event.name}</td>
              <td className="p-3">{event.type}</td>
              <td className="p-3 text-right">${event.expenses.toFixed(2)}</td>
              <td className="p-3 text-right">${event.revenue.toFixed(2)}</td>
              <td className="p-3 text-right">${event.profit.toFixed(2)}</td>
              <td className="p-3">
                <div className="flex justify-center space-x-2">
                  <Button
                    onClick={() => handleCreateInvoice(event)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Invoice
                  </Button>
                  <Button
                    onClick={() => handleEditEvent(event)}
                    size="sm"
                    variant="outline"
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(event.id)}
                    size="sm"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateInvoiceDialog
        open={showCreateInvoice}
        onOpenChange={setShowCreateInvoice}
        event={selectedEvent}
        setEvents={setEvents}
      />
      <EditEventDialog
        open={showEditEvent}
        onOpenChange={setShowEditEvent}
        event={selectedEvent}
        setEvents={setEvents}
      />
    </div>
  )
}

