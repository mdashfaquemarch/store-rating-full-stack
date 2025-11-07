import { prisma } from "../configs/index.js";
import CrudRepository from "./crud.repository.js";


class UserRepository extends CrudRepository {

    constructor() {
        super(prisma.user);
    }
}

export default UserRepository;