const { config } = require('../../database/config/configMariaDB');
const Contenedor = require('../../database/db');
class Productos {

    constructor() {
       this.tableName = 'productos';
       this.dbconfig = config;
       this.db = new Contenedor(this.tableName, this.dbconfig);
       this.cargar();
    }

    cargar(){
        try{
            const cargar = async () => {
                const existe = await this.db.tableExists();
                if(!existe) await this.db.createTable();
            };
            cargar();
        } catch(error){
            console.log(error);
        }
    }

    async save(obj){
        try{
            return await this.db.insert(obj);
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try{
            const result = await this.db.selectAll();
            return (result) ? result : false;
        } catch (error){
            console.log(error);
        }
    }

    getById(id){
        if(!id) return false;
        return this.db.selectById(id);
    }

    update(id, obj){
        if (!id || !obj) {
            return false;
        }
        return this.db.update({...obj, id});
    }

    delete(id){
        if(!id) return false;
        return this.db.delete(id);
    }
}

module.exports = Productos;