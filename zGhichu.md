# yarn run m:gen src/migrations/[name]
- tạo 1 lệnh di cư khi thay đổi các filed trong model || entity

# yarn run m:run
- đẩy lệnh di chuyển lên server

# buld app with docker (create image)
- docker build --no-cache --progress=plain -t [name] .

# run app with docker 
- docker run -it -p 8083:8083 [image_id]

# upload  ("https://lazypandatech.com/blog/NodeJS/28/How-to-upload-a-file-using-TypeScript-with-Node-and-Express/")
npm install multer @types/multer --save
npm install multer-s3 @types/multer-s3 --save
npm install aws-sdk --save

# populate in typeorm
```ts


import { DeleteResult, UpdateResult } from "typeorm";
import { ProductService } from "../../product/product.service";
import { BaseService } from "../../shared/services/base.service";
import { PurchaseProductDto } from "../dto/purchase-product.dto";
import { PurchaseProductEntity } from "../entities/purchases-products.entity";

export class PurchaseProductService extends BaseService<PurchaseProductEntity> {
    constructor(
        private readonly productService: ProductService = new ProductService()
    ) {
        super(PurchaseProductEntity);
    }

    async findAllPurchaseProducts(): Promise<PurchaseProductEntity[]> {
        // popilate c1 : chỉ lấy 1 cấp
        // return (await this.execRepository).find({ relations: ["product", "purchase"] });
        // popilate c2 : lấy nhiều cấp
        return (await this.execRepository).createQueryBuilder('purchases_products')
            .innerJoinAndSelect("purchases_products.purchase", "purchase")
            .innerJoinAndSelect("purchase.customer", "customer")
            // .innerJoinAndSelect("customer.purchases", "purchases")
            .innerJoinAndSelect("customer.user", "user")
            .innerJoinAndSelect("purchases_products.product", "product")
            .innerJoinAndSelect("product.category", "category")
            .getMany() // lay nhieu
    }

    async findPurchaseProductById(id: string): Promise<PurchaseProductEntity | null> {
        // popilate c3 : giống c1 nhưng lấy được 2 cấp
        // return (await this.execRepository).findOne({
        //     where: { id }, relations: [
        //         "product", "purchase",
        //         "product.category", "purchase.customer"
        //     ]
        // });
        return (await this.execRepository).findOne({
            where: { id },
            // popilate c4 : giống c1 lấy 1 cấp viết dạng object
            //  relations: {
            //     product: true,
            //     purchase: true
            // },
            // popilate c5 : giống c2 lấy được nhiều cấp viết dạng object
            join: {
                alias: "purchases_products",
                leftJoinAndSelect: {
                    "product": "purchases_products.product",
                    "category": "product.category",

                    "purchase": "purchases_products.purchase",
                    "customer": "purchase.customer",
                    "user": "customer.user"
                }
            }
        });
    }

    async createPurchaseProduct(body: PurchaseProductDto): Promise<PurchaseProductEntity> {
        // tạo đơn mua của 1 sản phẩm từ body
        const newPP = (await this.execRepository).create(body);

        // từ id của sản phẩm trong đơn mua tính giá tiền theo số lượng
        const prod = await this.productService.findProductById(newPP.product.id);
        newPP.totalPrice = prod!.price * newPP.quantityProduct;

        // lưu vào db đơn mua của sản phẩm vừa tạo
        return (await this.execRepository).save(newPP);
    }

    async deletePurchaseProduct(id: string): Promise<DeleteResult> {
        return (await this.execRepository).delete({ id });

        // chuyen deletedAt tu null sang Date
        return (await this.execRepository).softDelete({ id });
    }

    async updatePurchaseProduct(id: string, infoUpdate: PurchaseProductDto): Promise<UpdateResult> {
        return (await this.execRepository).update(id, infoUpdate);
    }
}

```


```ts
async findUserWithRelation(id: string): Promise<UserEntity | null> {
    return (await this.execRepository)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.customer", "customer")
        .where({ id })
        .getOne(); // lay 1
}
```


# mongodb+srv://hinhtv:hinhtv@cluster0.ymvz0os.mongodb.net/?retryWrites=true&w=majority