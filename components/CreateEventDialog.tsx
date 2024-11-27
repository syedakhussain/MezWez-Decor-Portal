'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [expenses, setExpenses] = useState([{ description: '', amount: 0 }])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({ date, name, type, expenses })
    onOpenChange(false)
  }

  const addExpense = () => {
    setExpenses([...expenses, { description: '', amount: 0 }])
  }

  const updateExpense = (index: number, field: 'description' | 'amount', value: string | number) => {
    const newExpenses = [...expenses]
    newExpenses[index][field] = value
    setExpenses(newExpenses)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Enter the details for the new event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div
className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Event Type</Label>
              <Select onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
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
            <div>
              <Label>Expenses (Optional)</Label>
              {expenses.map((expense, index) => (
                <div key={index} className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Description"
                    value={expense.description}
                    onChange={(e) => updateExpense(index, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value))}
                  />
                </div>
              ))}
              <Button type="button" onClick={addExpense} className="mt-2">Add Expense</Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

