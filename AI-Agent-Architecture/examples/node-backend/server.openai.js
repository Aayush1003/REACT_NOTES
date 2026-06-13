require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())

const OPENAI_KEY = process.env.OPENAI_API_KEY
if(!OPENAI_KEY){
  console.warn('No OPENAI_API_KEY set; this file is a template for wiring OpenAI.')
}

app.post('/api/ai', async (req, res)=>{
  const {input} = req.body
  if(!OPENAI_KEY){
    return res.status(500).json({error: 'OPENAI_API_KEY not configured'})
  }

  const prompt = `User: ${input}\nAssistant:`

  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role:'user', content: input}],
        max_tokens: 300
      })
    })

    const j = await r.json()
    const reply = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : JSON.stringify(j)
    res.json({reply, usage: j.usage || null})
  }catch(err){
    console.error(err)
    res.status(500).json({error: 'model call failed'})
  }
})

app.listen(3001, ()=>console.log('Node backend (OpenAI example) listening on 3001'))
