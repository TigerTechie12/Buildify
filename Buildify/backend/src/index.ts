require("dotenv").config();
import { Groq } from 'groq-sdk';
import express from 'express'
import fs from 'fs'
import cors from 'cors'
import { basePromptN } from './defaults/node';
import { basePromptR } from './defaults/react';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app=express()
app.use(cors())
app.use(express.json())
app.post('/template',async(req:any,res:any)=>{
    const prompt=req.body.prompt
  const response = await groq.chat.completions.create({
    messages: [
      {
        role:'system',
        content:'Return either node or react based on what do you think this project should be. Only return a single word either node or react.Do not return anything extra'
        },{
        role: "user",
        content: prompt
      }
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0,
    max_completion_tokens: 8000,
    top_p: 1,
    stream: true,
  });

  console.log("\uD83D\uDCE5 Streaming response...");

  let answer = '';
  for await (const chunk of response) {
    const contentPiece = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(contentPiece);
    answer += contentPiece;
  }
  answer = answer.trim();
 if(answer !='react' && answer !='node'){
    return res.status(403).json({message:"You cant access this"})
 }
if(answer==='react' || 'React' ){
  return  res.json({
        prompts:[BASE_PROMPT,basePromptR],
        uiPrompts:[basePromptR]
    })
}
if(answer==='node' || 'Node'){
   return res.json({
        prompts:[basePromptN],
        uiPrompts:[basePromptN]
    })
}


})
app.post("/chat",async(req,res)=>{
const messages=req.body.messages
const response = await groq.chat.completions.create({messages:[
  {
    role:"system",
    content:getSystemPrompt()

  }, ...messages,
],
 model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.7,
      max_completion_tokens: 8000,
      top_p: 1,
      stream: true,

})
    let fullResponse = ''
    for await (const chunk of response) {
      const contentPiece = chunk.choices[0]?.delta?.content || ''
      process.stdout.write(contentPiece)
      fullResponse += contentPiece
    }

    res.json({ response: fullResponse.trim() })
console.log(fullResponse.trim())
  } 
  


)
app.listen(3002)