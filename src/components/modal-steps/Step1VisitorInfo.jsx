import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export function Step1VisitorInfo({ data, onNext }) {
  const [visitors, setVisitors] = useState(data.visitors)

  const addVisitor = () => {
    setVisitors([...visitors, { email: '', firstName: '', lastName: '', phone: '' }])
  }

  const removeVisitor = (index) => {
    if (visitors.length > 1) {
      setVisitors(visitors.filter((_, i) => i !== index))
    }
  }

  const updateVisitor = (index, field, value) => {
    const updated = [...visitors]
    updated[index][field] = value
    setVisitors(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ visitors })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Visitor information</h2>
        <p className="text-sm text-gray-600 mt-1">Who will be visiting?</p>
      </div>

      <div className="space-y-6">
        {visitors.map((visitor, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            {visitors.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeVisitor(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {visitors.length > 1 && (
              <h3 className="font-medium">Visitor {index + 1}</h3>
            )}

            <div className="space-y-2">
              <Label htmlFor={`email-${index}`}>Visitor's email</Label>
              <Input
                id={`email-${index}`}
                type="email"
                placeholder="Enter email address"
                value={visitor.email}
                onChange={(e) => updateVisitor(index, 'email', e.target.value)}
                className="visitor-email"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${index}`}>
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`firstName-${index}`}
                  placeholder="e.g. John"
                  value={visitor.firstName}
                  onChange={(e) => updateVisitor(index, 'firstName', e.target.value)}
                  className="visitor-firstname"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lastName-${index}`}>
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`lastName-${index}`}
                  placeholder="e.g. Smith"
                  value={visitor.lastName}
                  onChange={(e) => updateVisitor(index, 'lastName', e.target.value)}
                  className="visitor-lastname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Phone number</Label>
              <div className="flex gap-2">
                <div className="w-12 h-10 flex items-center justify-center border rounded-md bg-muted">
                  🇺🇸
                </div>
                <Input
                  id={`phone-${index}`}
                  type="tel"
                  placeholder="e.g. +1234567890"
                  value={visitor.phone}
                  onChange={(e) => updateVisitor(index, 'phone', e.target.value)}
                  className="flex-1 visitor-phone"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addVisitor}
        className="w-full"
        data-testid="add-another-visitor"
      >
        + Add another visitor
      </Button>

      <Button type="submit" className="w-full">Continue</Button>
    </form>
  )
}

