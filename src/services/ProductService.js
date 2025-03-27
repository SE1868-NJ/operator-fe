import { instance } from "../lib/axios";

const ProductService = {
    async getTopProductInWeek(){
        const data = instance.get("/product/top5BestSellingProduct").then(({data}) => data.data).catch((err) => console.error(err.message));
        return data;
    }
}
export default ProductService;