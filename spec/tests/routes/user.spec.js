const { clearDatabase, connectToDatabase } = require("../../../db.connection");
const app = require("../../../index")
const supertest = require("supertest")
const request = supertest(app)

describe("users", () => {
    let userToAdd;
    beforeAll(async()=>{
        await connectToDatabase()
    })
    beforeEach(() => {
        userToAdd = {
            name: "salsxx",
            password: "1234"
        }
    })

    it("get all users 400", async () => {
        const res = await request.get("/users")
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("There is no users yet")
    })
    it("post user 400 password xx", async () => {
        userToAdd.password = "123" //wrong
        const res = await request.post("/users").send(userToAdd)
        expect(res.status).toBe(400)
    })
    it("post user 201", async () => {
        const res = await request.post("/users").send(userToAdd)
        expect(res.status).toBe(201)
        expect(res.body.name).toBe(userToAdd.name)
    })
    it("login user 400 password xxx", async () => {
        userToAdd.password = "2345"
        const res = await request.post("/users/login").send(userToAdd)
        expect(res.status).toBe(400)
        expect(res.body.message).toContain("password")
    })
    it("login user 400 username xxx", async () => {
        userToAdd.name = "2345"
        const res = await request.post("/users/login").send(userToAdd)
        expect(res.status).toBe(400)
        expect(res.body.message).toContain("userName")
    })
    it("login user 200", async () => {
        const res = await request.post("/users/login").send(userToAdd)
        const token = res.body
        expect(res.status).toBe(200)
        expect(token).toBeDefined()
    })
    it("get all users 400", async () => {
        const res = await request.get("/users")
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
    })
    afterAll(async () => {
        await clearDatabase()
    })
})