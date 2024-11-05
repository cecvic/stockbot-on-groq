'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Chat } from '../lib/types'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { toast } from 'sonner'

export function ChatSidebar() {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      setChats(data)
    } catch (error) {
      console.error('Error fetching chats:', error)
      toast.error('Failed to load chats')
    }
  }

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Chat'
        }),
      })
      const newChat = await response.json()
      setChats([...chats, newChat])
      router.push(`/chat/${newChat.id}`)
      toast.success('New chat created')
    } catch (error) {
      console.error('Error creating chat:', error)
      toast.error('Failed to create new chat')
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: chatId }),
      })
      setChats(chats.filter(chat => chat.id !== chatId))
      if (selectedChat === chatId) {
        router.push('/')
      }
      toast.success('Chat deleted')
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error('Failed to delete chat')
    }
  }

  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: chatId, title: newTitle }),
      })
      const updatedChat = await response.json()
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, title: updatedChat.title } : chat
      ))
      setIsRenaming(false)
      toast.success('Chat renamed')
    } catch (error) {
      console.error('Error renaming chat:', error)
      toast.error('Failed to rename chat')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={createNewChat}
        >
          + New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer hover:bg-gray-800 ${
              selectedChat === chat.id ? 'bg-gray-800' : ''
            }`}
            onClick={() => {
              setSelectedChat(chat.id)
              router.push(`/chat/${chat.id}`)
            }}
          >
            <span className="truncate flex-1">{chat.title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setNewTitle(chat.title)
                      setIsRenaming(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rename Chat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter new title"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsRenaming(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            renameChat(chat.id, newTitle)
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem 
                  className="text-red-600"
                  onSelect={(e) => {
                    e.preventDefault()
                    deleteChat(chat.id)
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  )
}
