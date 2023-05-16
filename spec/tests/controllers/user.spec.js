const { saveUser, getAllUsers } = require("../../../controllers/users");
const { connectToDatabase, closeDatabase, clearDatabase } = require("../../../db.connection");


describe('user controller: ', () => {
    let mockUser;
    beforeAll(async()=>{
        mockUser={
            name:"sals",
            password:"12345"
        }
      await connectToDatabase()
    })
    afterAll(async () => await clearDatabase());
    /**
     * Tests that a valid product can be created through the userController.
     */

    it('DB connected correctly', async () => {
        let user = await connectToDatabase()
        expect(connectToDatabase.bind(null)).not.toThrow()
    });
    it('user can be created correctly', async () => {
        let user = await saveUser(mockUser)
        expect(user.name).toBe(mockUser.name)
    });
    // xit('user can be created correctlyxxx', async () => {
    //     // expect(saveUser.bind(null,{name:"xxxx",password:"123"})).toThrow() //not working
    // });
    it('users can be showed correctly', async () => {
        let users = await getAllUsers()
        expect(users.length).toBe(1)
    });

});