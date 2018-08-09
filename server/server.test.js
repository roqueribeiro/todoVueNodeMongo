require('jasmine')
require('./server');
const frisby = require('frisby');

describe('TodoList Test API Calls', () => {

    it("Test method POST", () => {
        return frisby
            .post('http://localhost:3000/tasks', {
                name: 'Nova Tarefa',
                status: 'completed'
            })
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('status', 200);
    });

    it("Test method GET", () => {
        return frisby
            .get('http://localhost:3000/tasks')
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('status', 200);
    });

    it("Test method GET with search", () => {
        return frisby
            .get('http://localhost:3000/tasks/5b69a2c316f8e1114fcf6143')
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('status', 200);
    });

    it("Test method PUT", () => {
        return frisby
            .put('http://localhost:3000/tasks/5b69a2c316f8e1114fcf6143', {
                name: 'Tarefa Alterada',
                status: 'pending'
            })
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('status', 200);
    });

    it("Test method DELETE", () => {
        return frisby
            .del('http://localhost:3000/tasks/5b69a2c316f8e1114fcf6143')
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('status', 200);
    });

});