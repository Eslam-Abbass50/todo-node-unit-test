const supertest = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");
const req = supertest(app);
describe("lab testing:", () => {
  let user1, token, todoId, token2, user2Res;

  beforeAll(async () => {
    user1 = {
      name: "Eslam",
      email: "Eslam@gmail.com",
      password: "123456",
    };

    await req.post("/user/signup").send(user1);

    let user1Res = await req.post("/user/login").send(user1);
    token = user1Res.body.data;

    let todo = {
      title: "Do anything",
    };

    let todoRes = await req
      .post("/todo")
      .send(todo)
      .set({ authorization: token });

    todoId = todoRes.body.data._id;

    let user2 = {
      name: "Ali",
      email: "Ali@gmail.com",
      password: "Eslam123",
    };
    await req.post("/user/signup").send(user2);
    user2Res = await req.post("/user/login").send(user2);
    token2 = user2Res.body.data;
  });
  describe("users routes:", () => {
    it("GET /user/search should respond with the correct user with the name requested", async () => {
      // Note: user name must be sent in request query not request params
      let res = await req.get("/user/search").query({ name: user1.name });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(user1.name);
      expect(res.body.data.email).toBe(user1.email);
    });

    it("GET /user/search with invalid name should respond with status 404 and the message", async () => {
      let res = await req.get("/user/search").query({ name: "Nothing" });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("There is no user with name: Nothing");
    });
  });

  describe("todos routes:", () => {
    it("PATCH /todo/ with id only should respond with res status 400 and a message", async () => {
      let res = await req
        .patch(`/todo/${todoId}`)
        .set({ authorization: token })
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("must provide title and id to edit todo");
    });

    it("PATCH /todo/ with id and title should respond with status 200 and the new todo", async () => {
      let res = await req
        .patch(/todo/${todoId})
        .set({ authorization: token })
        .send({ title: "Do task 1" });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Do task 1");
    });

    it("GET  /todo/user should respond with the user's all todos", async () => {
      let res = await req.get("/todo/user").set({ authorization: token });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveSize(1);
    });

    it("GET  /todo/user for a user hasn't any todo, should respond with status 200 and a message", async () => {
      let res = await req.get("/todo/user").set({ authorization: token2 });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Couldn't find any todos for");
    });
  });

  afterAll(async () => {
    await clearDatabase();
  });
});