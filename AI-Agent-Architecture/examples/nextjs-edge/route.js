export async function POST(request) {
  try{
    const body = await request.json()
    // Lightweight validation and echo reply for edge example
    const input = body.input || ''
    return new Response(JSON.stringify({reply: `Edge echo: ${input}`}), {status:200, headers:{'Content-Type':'application/json'}})
  }catch(e){
    return new Response(JSON.stringify({error:'invalid request'}), {status:400, headers:{'Content-Type':'application/json'}})
  }
}
