'use client'

import { useState } from 'react'
import { useAuth } from '../../components/AuthProvider'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventsList } from '../../components/EventsList'
import { InvoiceList } from '../../components/InvoiceList'
import { AddEventForm } from '../../components/AddEventForm'
import { Event } from '../../types/Event' // Assuming Event type is defined here

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState<Event[]>([]) // Updated state for events

  if (!isAuthenticated) {
    router.replace('/')
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-script text-indigo-700">MezWez Decor</h1>
            <p className="text-gray-600 mt-1">Transforming Spaces, Creating Memories</p>
          </div>
          <Button 
            onClick={logout} 
            variant="outline"
            className="absolute top-6 right-6"
          >
            Logout
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <AddEventForm setEvents={setEvents} /> {/* Pass setEvents to AddEventForm */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="events" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger 
                  value="events" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600"
                >
                  Events List
                </TabsTrigger>
                <TabsTrigger 
                  value="invoices"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600"
                >
                  Invoices List
                </TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="p-0">
                <EventsList events={events} setEvents={setEvents} /> {/* Pass events and setEvents to EventsList */}
              </TabsContent>
              <TabsContent value="invoices" className="p-0">
                <InvoiceList events={events} setEvents={setEvents} /> {/* Pass events and setEvents to InvoiceList */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

