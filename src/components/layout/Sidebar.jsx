import { Home, Newspaper, Calendar, MapPin, BookOpen, FileText, UserPlus, Info, HelpCircle, ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Sidebar() {
  const location = useLocation()
  
  const navigation = [
    { name: 'Home', icon: Home, href: '#' },
    { name: 'My feed', icon: Newspaper, href: '#' },
    { name: 'Events', icon: Calendar, href: '#' },
    { name: 'Spaces', icon: MapPin, href: '#', hasSubmenu: true },
    { name: 'Book a Class', icon: BookOpen, href: '#' },
    { name: 'Submit a Request', icon: FileText, href: '#' },
    { name: 'Register a Visitor', icon: UserPlus, href: '/', current: location.pathname === '/' || location.pathname === '/visits/new' },
  ]
  
  const bottomLinks = [
    { name: 'About', icon: Info, href: '#' },
    { name: 'Help', icon: HelpCircle, href: '#' },
  ]
  
  return (
    <div className="flex h-screen w-48 flex-col bg-gray-50 border-r border-gray-200">
      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = item.current
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-white hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Link>
            )
          })}
        </div>
        
        <div className="mt-6 space-y-1 px-2">
          {bottomLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
        
        {/* Helpful Links Section */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Helpful links
          </h3>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-gray-700 hover:text-gray-900">
              Try Picnic!
            </a>
            <a href="#" className="block text-sm text-gray-700 hover:text-gray-900">
              Foodhub
            </a>
          </div>
        </div>
      </nav>
    </div>
  )
}

