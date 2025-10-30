import { Toaster } from 'sonner'
import { ClientIntakeForm } from './components/ClientIntakeForm'
import { FileSpreadsheet, Settings, Search } from 'lucide-react'

function App() {
  const handleViewCRM = () => {
    // Replace with your actual CRM Sheet URL
    window.open('https://docs.google.com/spreadsheets/d/YOUR_CRM_SHEET_ID', '_blank')
  }

  const handleSettings = () => {
    // This would open a settings modal
    alert('Settings panel coming soon! For now, configure webhook URL in .env file.')
  }

  const handleSearch = () => {
    // This would open a search modal
    alert('Client search coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg p-2">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Client Intake System</h1>
                <p className="text-xs text-gray-500">Phone & Walk-In Clients</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Staff Access Only
              </span>
              <button
                onClick={handleSearch}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Search clients"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={handleViewCRM}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                View Dashboard
              </button>
              <button
                onClick={handleSettings}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Quick Tip:</strong> Press <kbd className="px-2 py-1 text-xs bg-white border border-blue-300 rounded">Tab</kbd> to navigate between fields quickly. 
              Use <kbd className="px-2 py-1 text-xs bg-white border border-blue-300 rounded">Cmd/Ctrl + Enter</kbd> to submit.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Client Intake</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter client information below. A welcome email with document upload instructions will be sent automatically.
            </p>
          </div>
          
          <ClientIntakeForm />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Internal use only • Client will receive automated welcome email with upload link</p>
          <p className="mt-2">
            Need help? Contact IT Support or check the{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 underline">
              user guide
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
