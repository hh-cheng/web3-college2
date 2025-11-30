import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Web3 College</h1>
        <p className="text-lg text-muted-foreground">
          Learn blockchain development and Web3 technologies through
          comprehensive courses created by experts.
        </p>
        <div className="flex gap-4">
          <Button>Browse Courses</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Why Web3 College?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">On-Chain Courses</h3>
            <p className="text-sm text-muted-foreground">
              All courses are stored on-chain, ensuring transparency and
              permanence.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Expert Instructors</h3>
            <p className="text-sm text-muted-foreground">
              Learn from experienced developers and blockchain experts.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Flexible Learning</h3>
            <p className="text-sm text-muted-foreground">
              Study at your own pace with lifetime access to course materials.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
