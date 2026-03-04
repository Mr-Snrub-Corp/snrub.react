import { useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

function HomeView() {
  useEffect(() => {
    document.title = 'Snrub Corp | Welcome'
  }, [])

  return (
    <main className="h-screen flex flex-col lg:flex-row gap-4 bg-background">
      <div className="flex-1 flex items-center justify-center">
        <div className="p-6 pt-12 lg:p-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 lg:leading-normal text-center lg:text-left">
            Snrub Corp
          </h1>
          <p className="text-muted-foreground leading-normal mb-8 text-center lg:text-left">
            Welcome to the internal dashboard for Springfield's Nuclear Power Plant.
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-6">
            <Button asChild variant="secondary">
              <Link to="/auth/login">Login</Link>
            </Button>
            <Button variant="outline" disabled>
              Contact
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <img
          src="/img/power-plant-hero.png"
          alt="Nuclear power plant hero"
          className="h-full w-full object-cover lg:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]"
        />
      </div>
    </main>
  )
}

export default HomeView
