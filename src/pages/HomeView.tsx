import { useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

function HomeView() {
  useEffect(() => {
    document.title = "Snrub Corp | Welcome";
  }, []);

  return (
    <main className="bg-background flex h-screen flex-col gap-4 lg:flex-row">
      <div className="flex flex-1 items-center justify-center">
        <div className="p-6 pt-12 lg:p-12">
          <h1 className="text-foreground mb-4 text-center text-3xl font-bold lg:text-left lg:text-5xl lg:leading-normal">
            Snrub Corp
          </h1>
          <p className="text-muted-foreground mb-8 text-center leading-normal lg:text-left">
            Welcome to the internal dashboard for Springfield's Nuclear Power
            Plant.
          </p>
          <div className="flex items-center justify-center gap-6 lg:justify-start">
            <Button asChild variant="primary">
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
  );
}

export default HomeView;
