'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Event {
  id: number
  date: string
  name: string
  type: string
  expenses: number
  revenue: number
  profit: number
}

interface Expense {
  description: string
  amount: number
}

interface EditEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

export function EditEventDialog({ open, onOpenChange, event, setEvents }: EditEventDialogProps) {
  const [date, setDate] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([
    { description: '', amount: 0 },
    { description: '', amount: 0 },
    { description: '', amount: 0 }
  ])
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    if (event) {
      setDate(event.date)
      setEventName(event.name)
      setEventType(event.type)
      setTotalExpenses(event.expenses)
      // You might want to split the expenses into individual items here
      // For now, we'll just set the first expense to the total
      setExpenses([
        { description: 'Total Expenses', amount: event.expenses },
        { description: '', amount: 0 },
        { description: '', amount: 0 }
      ])
    }
  }, [event])

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
    setTotalExpenses(total)
  }, [expenses])

  const handleExpenseChange = (index: number, field: keyof Expense, value: string) => {
    const newExpenses = [...expenses]
    if (field === 'amount') {
      newExpenses[index][field] = parseFloat(value) || 0
    } else {
      newExpenses[index][field] = value
    }
    setExpenses(newExpenses)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    const updatedEvent: Event = {
      ...event,
      date,
      name: eventName,
      type: eventType,
      expenses: totalExpenses,
      profit: event.revenue - totalExpenses
    }

    setEvents(prevEvents => prevEvents.map(e => e.id === event.id ? updatedEvent : e))
    onOpenChange(false)
  }

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Event: {event.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="custom">Custom Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Expenses</h3>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-indigo-600 text-white text-sm font-medium">
                <div className="p-3">DESCRIPTION</div>
                <div className="p-3">AMOUNT</div>
              </div>
              
              {expenses.map((expense, index) => (
                <div key={index} className="grid grid-cols-2 border-t">
                  <div className="p-2">
                    <Input
                      placeholder="Enter description"
                      value={expense.description}
                      onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="p-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={expense.amount || ''}
                      onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-2 border-t bg-gray-50">
                <div className="p-3 text-right font-medium">Total Expenses:</div>
                <div className="p-3 font-medium">${totalExpenses.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Update Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

