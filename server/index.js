const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/auth/login", (req,res)=>{
    
})

app.post("/api/auth/register", (req,res)=>{
    
})

app.post('/api/messages', (req,res)=>{

})

app.post("/api/conversations", (req,res)=>{

})

app.listen(1338, () => {
  console.log("listening on port 1338");
});
