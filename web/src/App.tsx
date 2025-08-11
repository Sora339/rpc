import React, { useState } from 'react'
import { createClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { ElizaService } from './gen/eliza_connect'

const transport = createConnectTransport({ baseUrl: '/rpc' })
const client = createClient(ElizaService, transport)

export default function App(): React.JSX.Element {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<{ fromMe: boolean; message: string }[]>([])

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Connect RPC Chat (Eliza)</h2>
      <ol>
        {messages.map((m, i) => (
          <li key={i}>{`${m.fromMe ? 'ME' : 'ELIZA'}: ${m.message}`}</li>
        ))}
      </ol>
      <form
        onSubmit={async (e: React.FormEvent) => {
          e.preventDefault()
          const v = inputValue.trim()
          if (!v) return
          setInputValue('')
          setMessages((prev) => [...prev, { fromMe: true, message: v }])
          const res = await client.say({ sentence: v })
          setMessages((prev) => [...prev, { fromMe: false, message: res.sentence }])
        }}
      >
        <input
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          style={{ padding: 8, minWidth: 280 }}
          placeholder="Type here..."
        />
        <button type="submit" style={{ marginLeft: 8, padding: 8 }}>
          Send
        </button>
      </form>
    </div>
  )
}
