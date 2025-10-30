import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  FileText,
  UserCheck,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn, formatPhoneNumber, normalizePhoneNumber, capitalizeWords } from '../lib/utils'
import type { ClientIntakeFormData, WebhookPayload, RecentClient } from '../types'
import { SERVICE_TYPES, SOURCE_OPTIONS, STAFF_MEMBERS } from '../types'

export function ClientIntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReferredBy, setShowReferredBy] = useState(false)
  const [recentClients, setRecentClients] = useState<RecentClient[]>([])
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientIntakeFormData>({
    defaultValues: {
      assigned_to: 'Unassigned',
    },
  })

  const sourceValue = watch('source')
  const emailValue = watch('email')
  const phoneValue = watch('phone')

  // Show referred_by field if source includes "Referral"
  useEffect(() => {
    if (sourceValue && sourceValue.includes('Referral')) {
      setShowReferredBy(true)
    } else {
      setShowReferredBy(false)
      setValue('referred_by', '')
    }
  }, [sourceValue, setValue])

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted)
  }

  // Check for duplicates (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailValue || phoneValue) {
        checkForDuplicate(emailValue, normalizePhoneNumber(phoneValue))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [emailValue, phoneValue])

  const checkForDuplicate = async (_email: string, _phone: string) => {
    // This would call your Make.com webhook or API endpoint
    // For now, we'll just clear the warning since we don't have the backend set up
    setDuplicateWarning(null)
    // Future implementation:
    // const response = await fetch(`${webhookUrl}/check-duplicate?email=${email}&phone=${phone}`)
    // const data = await response.json()
    // if (data.exists) { setDuplicateWarning(`Client found: ${data.client.name}`) }
  }

  const onSubmit = async (data: ClientIntakeFormData) => {
    setIsSubmitting(true)

    try {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL

      if (!webhookUrl) {
        throw new Error('Webhook URL not configured. Please set VITE_WEBHOOK_URL in environment variables.')
      }

      // Prepare payload
      const payload: WebhookPayload = {
        ...data,
        phone: normalizePhoneNumber(data.phone), // Send clean phone number
        timestamp: new Date().toISOString(),
        submitted_by: 'staff_user', // This could be dynamic based on auth
        form_version: 'staff_v1',
      }

      console.log('Submitting to webhook:', webhookUrl)
      console.log('Payload:', payload)

      // Submit to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`)
      }

      // Success!
      toast.success(`✅ ${data.name} added successfully`, {
        description: `Welcome email sent to ${data.email}`,
        duration: 4000,
      })

      // Add to recent clients
      const newClient: RecentClient = {
        name: data.name,
        email: data.email,
        service_type: data.service_type,
        timestamp: new Date().toISOString(),
      }
      setRecentClients((prev) => [newClient, ...prev.slice(0, 4)])

      // Save to localStorage
      localStorage.setItem('recentClients', JSON.stringify([newClient, ...recentClients.slice(0, 4)]))

      // Reset form
      reset({
        assigned_to: 'Unassigned',
      })

      // Focus on name field
      setTimeout(() => {
        document.getElementById('name')?.focus()
      }, 100)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('❌ Failed to save client', {
        description: error instanceof Error ? error.message : 'Please check your internet connection and try again.',
        action: {
          label: 'Retry',
          onClick: () => onSubmit(data),
        },
      })

      // Save to localStorage as backup
      const backup = localStorage.getItem('pendingSubmissions') || '[]'
      const pending = JSON.parse(backup)
      pending.push({ ...data, timestamp: new Date().toISOString() })
      localStorage.setItem('pendingSubmissions', JSON.stringify(pending))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load recent clients from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentClients')
    if (saved) {
      setRecentClients(JSON.parse(saved))
    }
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit])

  // Show floating button when scrolling past submit button
  useEffect(() => {
    const handleScroll = () => {
      const submitButton = document.querySelector('[data-submit-button]')
      if (submitButton) {
        const rect = submitButton.getBoundingClientRect()
        setShowFloatingButton(rect.bottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Possible duplicate client</p>
              <p className="text-sm text-yellow-700 mt-1">{duplicateWarning}</p>
              <button
                type="button"
                className="text-sm font-medium text-yellow-800 underline mt-2 hover:text-yellow-900"
                onClick={() => {
                  // This would open the CRM in a new tab
                  window.open('https://docs.google.com/spreadsheets/d/YOUR_CRM_SHEET_ID', '_blank')
                }}
              >
                View Existing Client
              </button>
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              autoFocus
              {...register('name', { required: 'Name is required' })}
              onChange={(e) => {
                const capitalized = capitalizeWords(e.target.value)
                setValue('name', capitalized)
              }}
              className={cn(
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.name ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="John Smith"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              onChange={(e) => {
                setValue('email', e.target.value.toLowerCase())
              }}
              className={cn(
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.email ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              type="tel"
              {...register('phone', {
                required: 'Phone is required',
                minLength: {
                  value: 10,
                  message: 'Phone must be 10 digits',
                },
              })}
              onChange={handlePhoneChange}
              className={cn(
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                errors.phone ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="(555) 123-4567"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        {/* Service Type */}
        <div>
          <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="service_type"
              {...register('service_type', { required: 'Service type is required' })}
              className={cn(
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white',
                errors.service_type ? 'border-red-300' : 'border-gray-300'
              )}
            >
              <option value="">Select service type...</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {errors.service_type && <p className="mt-1 text-sm text-red-600">{errors.service_type.message}</p>}
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
            How did they reach us? *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="source"
              {...register('source', { required: 'Source is required' })}
              className={cn(
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white',
                errors.source ? 'border-red-300' : 'border-gray-300'
              )}
            >
              <option value="">Select source...</option>
              {SOURCE_OPTIONS.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
          {errors.source && <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>}
        </div>

        {/* Referred By (conditional) */}
        {showReferredBy && (
          <div>
            <label htmlFor="referred_by" className="block text-sm font-medium text-gray-700 mb-2">
              Referred By
            </label>
            <input
              id="referred_by"
              type="text"
              {...register('referred_by')}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Client name or partner name"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Internal Notes
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="notes"
              {...register('notes')}
              rows={4}
              maxLength={500}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Urgent request, special circumstances, follow-up needed..."
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {watch('notes')?.length || 0}/500 characters
          </p>
        </div>

        {/* Assigned To */}
        <div>
          <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCheck className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="assigned_to"
              {...register('assigned_to')}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              {STAFF_MEMBERS.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            data-submit-button
            className={cn(
              'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all',
              'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Create Client & Send Welcome Email
              </>
            )}
          </button>
          {!isSubmitting && (
            <p className="mt-2 text-center text-sm text-gray-500">
              This will send an email to: <strong>{watch('email') || 'client'}</strong>
            </p>
          )}
        </div>
      </form>

      {/* Floating Submit Button */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => handleSubmit(onSubmit)()}
            disabled={isSubmitting}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white shadow-lg transition-all',
              'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
              'hover:shadow-xl hover:scale-105',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="hidden sm:inline">Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Submit Client</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Recent Clients Sidebar */}
      {recentClients.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Last 5 Clients Added
          </h3>
          <ul className="space-y-2">
            {recentClients.map((client, index) => (
              <li key={index} className="text-sm text-gray-600 flex justify-between items-center">
                <span>
                  <strong className="text-gray-900">{client.name}</strong> - {client.service_type}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(client.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
