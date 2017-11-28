import models from '../../models';

const Wall = models.wall;

/*
 sequelize model:create --name wall --attributes 'name:string,text:text,autor_id:integer' --force
 */
const Data = new Date();
const Year = Data.getFullYear();
const Month = Data.getMonth();
const Day = Data.getDate();
let date = Day + ':' + Month + ':' + Year;

export function listWall(id) {
    return Wall.findAll({
        where: {
            autor_id: id
        }
    });
}

export function addWall(data, id) {
    return Wall.create({
        name: data.name,
        text: data.text,
        date: date,
        autor_id: id
    });
}

export function updateWall(data) {
    return Wall.update({
        make: data.check
    }, {
        where: {
            id: data.id
        }
    });
}

export function deleteWall(id) {
    return Wall.destroy({
        where: {
            id: id
        }
    });
}

