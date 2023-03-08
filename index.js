const express =require('express')
const app =express()
const mongoose=require('mongoose')
const cors=require('cors')
app.use(cors())
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const route=require('./route/routes')
 

mongoose.connect('mongodb+srv://chandra:chandra@cluster0.wpffovp.mongodb.net/?retryWrites=true&w=majority')
.then(res=>console.log("database connetced successfully"))
.catch((err)=>console.log(err))


app.get('/',(req,res)=>{
    res.json({"mess":"hello api testing"})
})

app.use('/api',route)

app.listen(3001,(e)=>{
    console.log("your server is running on 3001")
})