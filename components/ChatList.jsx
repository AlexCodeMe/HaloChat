'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox'
import Loader from './Loader'

const ChatList = ({ currentChatId }) => {
  const { data: sessions } = useSession()
  const currentUser = sessions?.user

  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState([])
  const [search, setSearch] = useState('')

  const getChats = async () => {
    try {
      const res = await fetch(search !== '' 
        ? `/api/users/${currentUser._id}/searchChat/${search}` 
        : `/api/users/${currentUser._id}`)
      const data = await res.json()
      setChats(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      getChats()
    }
  }, [currentUser, search])

  console.log(chats)

  return loading ? (
    <Loader />
  ) : (
    <div className='chat-list'>
        <input placeholder='Search chat...' className='input-search' value={search} onChange={(e) => setSearch(e.target.value)}/>
        <div className='chats'>
          {chats?.map((chat, index) => (
            <ChatBox chat={chat} key={index} currentUser={currentUser} currentChatId={currentChatId} />
          ))}
        </div>
    </div>
  )
}

export default ChatList