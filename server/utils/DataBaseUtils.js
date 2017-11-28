import models from '../../models';


const Tasks = models.task;
const Users = models.user;
/*
 sequelize model:create --name user --attributes 'username:string,password:string,name:string,lasname:string,email:string,gender:string,phone:string,about:text,address:string,avatar:string,status:text' --force
 */

export function add(dataTask) {
    return User.create({
        username: dataTask.name,
        password: dataTask.task
    });
}

export function listTasks() {
    return Tasks.findAll();
}

export function getTask(id) {
    return Tasks.findOne({
        where: {
            id: id
        }
    });
}

export function updateAvatar(url, id) {
    return Users.update({
        avatar: url
    }, {
        where: {
            id: id
        }
    });
}

export function updateStatus(data, id) {
    return Users.update({
        status: data.status
    }, {
        where: {
            id: id
        }
    });
}

export function UpDateUser(data, id) {
    return Users.update({
        name: data.name,
        lasname: data.lasname,
        email: data.email,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        about: data.about
    }, {
        where: {
            id: id
        }
    });
}

export function createTask(dataTask) {
    return Tasks.create({
        name: dataTask.name,
        task: dataTask.task,
        urgency: dataTask.urgency,
        make: dataTask.make
    });
}

export function getCheck(data) {
    return Tasks.findOne({
        where: {
            id: 1
        }
    });
}

export function updateCheck(data) {
    return Tasks.update({
        make: data.check
    }, {
        where: {
            id: data.id
        }
    });
}

export function deleteTask(id) {
    return Tasks.destroy({
        where: {
            id: id
        }
    });
}

