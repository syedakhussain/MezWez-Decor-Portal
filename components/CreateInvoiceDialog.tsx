'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Printer } from 'lucide-react'

interface Event {
  id: number
  date: string
  name: string
  type: string
  expenses: number
  revenue: number
  profit: number
}

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
}

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

export function CreateInvoiceDialog({ open, onOpenChange, event, setEvents }: CreateInvoiceDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0 }
  ])
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState(0)
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    const discountAmount = subtotal * (discount / 100)
    const newTotal = subtotal - discountAmount
    setTotal(newTotal)
  }, [items, discount])

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items]
    if (field === 'rate' || field === 'quantity') {
      newItems[index][field] = parseFloat(value) || 0
    } else {
      newItems[index][field] = value
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    const newInvoice = {
      id: Date.now(),
      invoiceNumber,
      clientName,
      clientPhone,
      eventName: event.name,
      items,
      discount,
      total,
      status: 'Unpaid' as const
    }

    // Update the event with the new revenue and profit
    setEvents(prevEvents => prevEvents.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          revenue: e.revenue + total,
          profit: e.profit + total
        }
      }
      return e
    }))

    // Here you would typically save the invoice to your backend
    console.log('New Invoice:', newInvoice)

    // Reset form and close dialog
    setInvoiceNumber('')
    setClientName('')
    setClientPhone('')
    setItems([{ description: '', quantity: 1, rate: 0 }])
    setDiscount(0)
    onOpenChange(false)
  }

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current.innerHTML
      const originalContent = document.body.innerHTML
      document.body.innerHTML = printContent
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Invoice for {event.name}</DialogTitle>
        </DialogHeader>
        <div ref={invoiceRef}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Client Phone</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-indigo-600 text-white text-sm font-medium">
                <div className="col-span-5 p-3">DESCRIPTION</div>
                <div className="col-span-2 p-3">QUANTITY</div>
                <div className="col-span-2 p-3">RATE</div>
                <div className="col-span-2 p-3">TOTAL</div>
                <div className="col-span-1 p-3"></div>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 border-t">
                  <div className="col-span-5 p-2">
                    <Input
                      placeholder="Enter description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="col-span-2 p-2">
                    <Input
                      type="number"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="col-span-2 p-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.rate || ''}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="col-span-2 p-2 flex items-center">
                    ${(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <div className="col-span-1 p-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-12 border-t">
                <div className="col-span-11 p-2">
                  <Button type="button" variant="outline" onClick={addItem} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-12 border-t bg-gray-50">
                <div className="col-span-9 p-3 text-right font-medium">Subtotal:</div>
                <div className="col-span-3 p-3 font-medium">
                  ${items.reduce((sum, item) => sum + item.quantity * item.rate, 0).toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-12 border-t bg-gray-50">
                <div className="col-span-7 p-3 text-right font-medium">Discount (%):</div>
                <div className="col-span-2 p-3">
                  <Input
                    type="number"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
                <div className="col-span-3 p-3 font-medium">
                  ${(items.reduce((sum, item) => sum + item.quantity * item.rate, 0) * discount / 100).toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-12 border-t bg-gray-50">
                <div className="col-span-9 p-3 text-right font-medium">Total:</div>
                <div className="col-span-3 p-3 font-medium">${total.toFixed(2)}</div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
            <Printer className="mr-2 h-4 w-4" /> Save to PDF
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700">
            Create Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

