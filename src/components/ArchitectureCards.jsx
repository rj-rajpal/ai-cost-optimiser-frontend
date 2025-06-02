import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ArchitectureCards({ cards }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(({ id, title, description, icon: Icon }) => (
        <Card key={id} className="flex flex-col">
          <CardHeader className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {description}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 