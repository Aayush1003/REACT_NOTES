const express = require('express')
const app = express()
app.use(express.json())

app.post('/api/ai', async (req, res)=>{
  const {input} = req.body
  // Replace with real model call in production
  const fakeResponse = {reply: `Echo: ${input}`}
  res.json(fakeResponse)
})

app.get('/api/health', (req, res)=>res.json({status:'ok'}))

app.listen(3001, ()=>console.log('Node backend listening on 3001'))
