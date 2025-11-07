import StoreRepository from "../repositories/store.repository.js"


const storeRepo = new StoreRepository();



const fetchUserlistOfRatingService = async (user) => {

}

const getStoreByIdService = async (params) => {
   const store = await storeRepo.findById(
    {
      where: {
        id: params.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true
      }
    
    }
   )

   return store;
}


const getAllStoreService = async () => {

    const stores = await storeRepo.findAll({
      select: {
        id: true,
        name: true,
        email: true,
        address: true
      }
    });

    return stores;
}

export {
  
    fetchUserlistOfRatingService,
    getStoreByIdService,
    getAllStoreService
}