export interface ClientIntakeFormData {
  name: string
  email: string
  phone: string
  service_type: string
  source: string
  referred_by?: string
  notes?: string
  assigned_to?: string
}

export interface WebhookPayload extends ClientIntakeFormData {
  timestamp: string
  submitted_by: string
  form_version: string
}

export interface RecentClient {
  name: string
  email: string
  service_type: string
  timestamp: string
}

export interface DuplicateCheckResponse {
  exists: boolean
  client?: {
    name: string
    email: string
    phone: string
    last_contact: string
    service_type: string
  }
}

export const SERVICE_TYPES = [
  'Personal Tax Return',
  'Business Tax Return',
  'Personal + Business',
  'Self-Employed / 1099',
  'Rental Property',
  'Investment Income',
  'Estate/Trust',
  'Amended Return',
] as const

export const SOURCE_OPTIONS = [
  'Phone Call',
  'Walk-In',
  'Referral (Client)',
  'Referral (Partner)',
  'Google Search',
  'Social Media',
  'Other',
] as const

export const STAFF_MEMBERS = [
  'Unassigned',
  'Sarah Johnson',
  'Mike Chen',
  'Alex Rodriguez',
] as const
