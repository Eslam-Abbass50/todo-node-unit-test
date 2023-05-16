const app=require("../../../index")
const supertest= require("supertest")
const request= supertest(app)

describe("index",()=>{
    it("xx",async()=>{
        const res= await request.get("/")
        expect(res.status).toBe(404)
    })
})