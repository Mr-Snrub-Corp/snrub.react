import { useState } from 'react'
import { Button } from '@/components/ui/button'

function Dashboard() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <div className="space-y-4">
        <Button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </Button>
        <p className="text-sm text-muted-foreground">
          Edit <code>src/pages/Dashboard.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default Dashboard
