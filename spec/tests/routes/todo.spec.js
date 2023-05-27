const app=require("../../../index")
const supertest= require("supertest")
const request= supertest(app)
const { clearDatabase, connectToDatabase, closeDatabase } = require("../../../db.connection")

describe("todos",()=>{
    let newTodo,newUser,token;
    
    beforeAll(async()=>{
        await connectToDatabase()
        newTodo={
            title:"todo 1"
        }
        newUser={
            name:"sals 2",
            password:"1234" //must be not crypted
        }        
        await request.post("/users").send(newUser)
        const response= await request.post("/users/login").send(newUser)
        token=response.body
    })
    it("get all todos not autho xxx",async()=>{
        const res= await request.get("/todos")
        expect(res.status).toBe(403)
        expect(res.body.message).toContain("not authenticated")
    })
    it("get all todos",async()=>{
        const res= await request.get("/todos").set("authorization",token)
        expect(res.status).toBe(200)
        expect(res.body.message).toContain("Couldn't find any todos")
        
    })
    it("post todo with no title xxx",async()=>{
        const res= await request.post("/todos").set("authorization",token)
        expect(res.status).toBe(205)//validator package send status 205
    })
    it("post todo 201",async()=>{
        const res= await request.post("/todos").set("authorization",token).send(newTodo)
        expect(res.status).toBe(201)
        newTodo=res.body
        const res2=await request.get("/todos").set("authorization",token)
        expect(res2.body.length).toBe(1)
    })
    it("get todo 200",async()=>{
        const res= await request.get("/todos/"+newTodo._id).set("authorization",token)
        expect(res.status).toBe(200)
        expect(res.body.title).toBe(newTodo.title)
        expect(res.body.userId).toBe(newTodo.userId)
    })

    afterAll(async () => {
        await clearDatabase()
        await closeDatabase()
    })
})