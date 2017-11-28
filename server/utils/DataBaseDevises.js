import models from '../../models';

const Devices = models.device;
const Data = new Date();
const Year = Data.getFullYear();
const Month = Data.getMonth();
const Day = Data.getDate();
const Hour = Data.getHours();
const Minutes = Data.getMinutes();
const Seconds = Data.getSeconds();

/*
 sequelize model:create --name device --attributes 'id_device:string,name:string,token:string,status:boolean,autor_id:integer,pin:integer,column:integer,row:integer,text:text' --force
 */

export function listDevises() {
    return Devices.findAll();
}

export function getDevice(pin) {
    return Devices.findAll({
        where: {
            pin: pin
        }
    });
}

export function getDevices(id) {
    return Devices.findAll({
        where: {
            autor_id: id
        }
    });
}


export function swichDevice(data, id) {
    return Devices.update({
        status: data.swich
    }, {
        where: {
            autor_id: id,
            id: data.id
        }
    });
}

export function deviceDragAndDrop(data) {

    return Devices.update({
        column: data.column,
        row: data.row
    }, {
        where: {
            id: data.id
        }
    });
}

export function addDevice(data, id) {

    return Devices.create({
        id_device: Day + Month + Year + Hour * Minutes + '' + Seconds,
        token: Day + "" + Month + "" + Minutes + "" + Seconds + '10',
        status: false,
        autor_id: id,
        name: data.name,
        pin: data.pin,
        column: data.column,
        row: 0,
        text: data.text
    });
}

export function deviceDelete(data, id) {
    return Devices.destroy({
        where: {
            autor_id: id,
            id: data.id
        }
    });
}

