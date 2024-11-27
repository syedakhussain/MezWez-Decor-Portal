'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Invoice {
  id: number
  invoiceNumber: string
  clientName: string
  clientPhone: string
  dueDate: string
  details: string
  amount: number
  eventId: number
  eventName: string
  status: 'Paid' | 'Unpaid'
}

interface EditInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSave: (invoice: Invoice) => void
}

export function EditInvoiceDialog({ open, onOpenChange, invoice, onSave }: EditInvoiceDialogProps) {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ ...invoice })
    }
  }, [invoice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedInvoice) {
      onSave(editedInvoice)
      onOpenChange(false)
    }
  }

  if (!editedInvoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>Make changes to the invoice here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoiceNumber" className="text-right">
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                value={editedInvoice.invoiceNumber}
                onChange={(e) => setEditedInvoice({ ...editedInvoice, invoiceNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Client Name
              </Label>
              <Input
                id="clientName"
                value={editedInvoice.clientName}
                onChange={(e) => setEditedInvoice({ ...editedInvoice, clientName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientPhone" className="text-right">
                Client Phone
              </Label>
              <Input
                id="clientPhone"
                value={editedInvoice.clientPhone}
                onChange={(e) => setEditedInvoice({ ...editedInvoice, clientPhone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={editedInvoice.dueDate}
                onChange={(e) => setEditedInvoice({ ...editedInvoice, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">
                Details
              </Label>
              <Textarea
                id="details"
                value={editedInvoice.details}
                onChange={(e) => setEditedInvoice({ ...editedInvoice, details: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={editedInvoice.amount}
                onChange={(e) => setEditedInvoice({ ...editedInvoice, amount: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value: 'Paid' | 'Unpaid') => setEditedInvoice({ ...editedInvoice, status: value })}
                defaultValue={editedInvoice.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

