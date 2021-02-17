export enum CustomerTypeEnum {
    Brand = 2,
    Retailer = 3
}


export class CustomerTypeUtils {
    public static getCustomerTypeText(type) {
        switch (type) {
            case CustomerTypeEnum.Brand: return 'Brand';
            case CustomerTypeEnum.Retailer: return 'Retailer';
        }
    }

    public static getAllCustomerType() {
        const options = [
            {
                value: CustomerTypeEnum.Brand,
                label: this.getCustomerTypeText(CustomerTypeEnum.Brand)
            },
            {
                value: CustomerTypeEnum.Retailer,
                label: this.getCustomerTypeText(CustomerTypeEnum.Retailer)
            }
        ];
        return options;
    }
}