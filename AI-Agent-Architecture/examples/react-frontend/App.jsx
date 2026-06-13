import React, {useState} from 'react'

export default function App(){
  const [input, setInput] = useState('')
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  async function send(){
    setLoading(true)
    try{
      const r = await fetch('http://localhost:3001/api/ai', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({input})})
      const j = await r.json()
      setResp(j)
    }catch(e){
      setResp({error: 'Request failed'})
    }finally{
      setLoading(false)
    }
  }

  return (
    <div style={{padding:20}}>
      <h3>AI Agent Demo</h3>
      <textarea rows={6} cols={60} value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter a prompt" />
      <div>
        <button onClick={send} disabled={loading}>Send</button>
        {loading && <span style={{marginLeft:8}}>Loading...</span>}
      </div>
      <pre style={{background:'#f7f7f7', padding:10, marginTop:10}}>{JSON.stringify(resp,null,2)}</pre>
    </div>
  )
}
