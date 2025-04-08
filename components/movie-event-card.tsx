import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export interface MovieEvent {
  id: number
  title: string
  time: string
  date: string
  description: string
  image: string
  host: {
    name: string
    avatar: string
  }
}

export default function MovieEventCard({ event }: { event: MovieEvent }) {
  return (
    <div className="relative overflow-hidden rounded-md bg-zinc-900 border border-zinc-800">
      <div className="aspect-video relative">
        <Image
          src={event.image || `/placeholder.svg?height=300&width=600`}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold">{event.title}</h3>
        <p className="text-sm text-zinc-400 mt-1">
          {event.time} · {event.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={event.host.avatar} />
              <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-zinc-400">{event.host.name}</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Yep, I'm in
          </Button>
        </div>
      </div>
    </div>
  )
}
