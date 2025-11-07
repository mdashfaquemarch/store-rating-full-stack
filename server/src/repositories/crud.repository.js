

class CrudRepository {

    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const doc = await this.model.create(data);
        return doc;
    }

    async findById(data) {
        const doc = await this.model.findUnique(data)
        return doc;
    }

    async destroy(data) {
        const doc = await this.model.delete(data);
        return doc;
    }

    async update(data) {
        const doc = await this.model.update(data);
        return doc;
    }

    async findAll(data) {
        const doc = await this.model.findMany(data);
        return doc;
    }

    async count(data) {
        const doc = await this.model.count(data);
        return doc;
    }

    async countOnly() {
        const doc = await this.model.count();
        return doc;
    }

}

export default CrudRepository;