export enum ApplicationType {
    Web = 1,
    Consumer = 2,
    ServiceEngineer = 3,
    OutletManager = 4
}


export class ApplicationTypeUtils {
    public static getApplicationTypeText(type) {
        switch (type) {
            case ApplicationType.Web: return 'Web ';
            case ApplicationType.Consumer: return 'Consumer';
            case ApplicationType.ServiceEngineer: return 'Service Engineer';
            case ApplicationType.OutletManager: return 'Outlet Manager';
        }
    }


    public static getAllApplicationType() {
        const options = [
            {
                key: ApplicationType.Web,
                value: this.getApplicationTypeText(ApplicationType.Web)
            },
            {
                key: ApplicationType.Consumer,
                value: this.getApplicationTypeText(ApplicationType.Web)
            },
            {
                key: ApplicationType.ServiceEngineer,
                value: this.getApplicationTypeText(ApplicationType.Web)
            },
            {
                key: ApplicationType.OutletManager,
                value: this.getApplicationTypeText(ApplicationType.Web)
            }
        ];
        return options;
    }
}