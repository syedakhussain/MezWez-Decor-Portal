'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Invoice {
  id: number
  invoiceNumber: string
  clientName: string
  clientPhone: string
  eventName: string
  total: number
  status: 'Paid' | 'Unpaid'
}

interface InvoiceListProps {
  invoices: Invoice[]
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>
}

export function InvoiceList({ invoices, setInvoices }: InvoiceListProps) {
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
  }

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    )
    setEditingInvoice(null)
  }

  const handleDeleteInvoice = (invoiceId: number) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-indigo-600 text-white text-sm">
            <th className="p-3 text-left">INVOICE #</th>
            <th className="p-3 text-left">CLIENT NAME</th>
            <th className="p-3 text-left">CLIENT PHONE</th>
            <th className="p-3 text-left">EVENT NAME</th>
            <th className="p-3 text-right">TOTAL</th>
            <th className="p-3 text-center">STATUS</th>
            <th className="p-3 text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b">
              {editingInvoice && editingInvoice.id === invoice.id ? (
                <>
                  <td className="p-3">
                    <Input
                      value={editingInvoice.invoiceNumber}
                      onChange={(e) =>
                        setEditingInvoice({ ...editingInvoice, invoiceNumber: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={editingInvoice.clientName}
                      onChange={(e) =>
                        setEditingInvoice({ ...editingInvoice, clientName: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      value={editingInvoice.clientPhone}
                      onChange={(e) =>
                        setEditingInvoice({ ...editingInvoice, clientPhone: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-3">{editingInvoice.eventName}</td>
                  <td className="p-3 text-right">
                    <Input
                      type="number"
                      value={editingInvoice.total}
                      onChange={(e) =>
                        setEditingInvoice({
                          ...editingInvoice,
                          total: parseFloat(e.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="p-3 text-center">
                    <Select
                      value={editingInvoice.status}
                      onValueChange={(value) =>
                        setEditingInvoice({ ...editingInvoice, status: value as 'Paid' | 'Unpaid' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <Button
                        onClick={() => handleUpdateInvoice(editingInvoice)}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingInvoice(null)}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3">{invoice.invoiceNumber}</td>
                  <td className="p-3">{invoice.clientName}</td>
                  <td className="p-3">{invoice.clientPhone}</td>
                  <td className="p-3">{invoice.eventName}</td>
                  <td className="p-3 text-right">${invoice.total.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <Button
                        onClick={() => handleEditInvoice(invoice)}
                        size="sm"
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

