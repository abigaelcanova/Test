import { worker } from './browser'

// Start the MSW worker
worker.start({
  onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
})

