const { saveUser } = require("../../../controllers/users");
const { saveTodo,getTodoById, getTodos, EditTodoById, deleteAllTodos } = require("../../../controllers/todos");
const { connectToDatabase, clearDatabase  } = require("../../../db.connection");


describe('todo controller: ', () => {
    let mockUser, mockTodo;
    beforeAll(async () => {
        await connectToDatabase()
        mockUser = {
            name: "sals 3",
            password: "12345"
        }
        let user = await saveUser(mockUser)
        mockTodo = {
            userId: user._id,
            title: "tttt"
        }
    })
    afterAll(async () => await clearDatabase());
    it('todo can be created correctly', async () => {
        let todo = await saveTodo(mockTodo)
        expect(todo.title).toBe(mockTodo.title)
        mockTodo._id = todo._id
    });
    it('todo can be got by id correctly', async () => {
        let todo = await getTodoById(mockTodo._id)
        expect(todo.title).toBe(mockTodo.title)
    });
    it('todos can be showed correctly', async () => {
        let todos = await getTodos()
        expect(todos.length).toBe(1)
    });
    it('todo can be edit correctly', async () => {
        mockTodo.title = "new"
        let todo = await EditTodoById(mockTodo._id, mockTodo.title)
        expect(todo.title).toBe(mockTodo.title)
    });
    it('todo can be deleted correctly', async () => {
        await deleteAllTodos()
        let todos = await getTodos()
        expect(todos.length).toBe(0)
        expect(todos).toEqual([])
    });
});