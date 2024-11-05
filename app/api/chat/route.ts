import { NextResponse } from 'next/server'
import { Chat, Message } from '../../../lib/types'
import { Groq } from 'groq-sdk'
import { StreamingTextResponse } from 'ai'

// In-memory store for chats (replace with database in production)
let chats: Chat[] = []

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function GET() {
  return NextResponse.json(chats)
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    
    // If it's a new chat creation request
    if (!json.messages) {
      const newChat: Chat = {
        id: Math.random().toString(36).substring(7),
        title: json.title || 'New Chat',
        createdAt: new Date(),
        userId: 'local',
        path: `/chat/${json.id}`,
        messages: []
      }
      chats.push(newChat)
      return NextResponse.json(newChat)
    }

    // If it's a chat message request
    const { messages } = json
    const lastMessage = messages[messages.length - 1]

    // Create and stream the response
    const response = await groq.chat.completions.create({
      messages: messages.map((message: Message) => ({
        role: message.role,
        content: message.content
      })),
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    })

    // Return the streaming response
    return new StreamingTextResponse(response.stream())
  } catch (error) {
    console.error('Error processing chat request:', error)
    return NextResponse.json(
      { error: 'Error processing chat request' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  const { id, title } = await req.json()
  const chatIndex = chats.findIndex(chat => chat.id === id)
  if (chatIndex !== -1) {
    chats[chatIndex].title = title
    return NextResponse.json(chats[chatIndex])
  }
  return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const chatIndex = chats.findIndex(chat => chat.id === id)
  if (chatIndex !== -1) {
    chats = chats.filter(chat => chat.id !== id)
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
}
