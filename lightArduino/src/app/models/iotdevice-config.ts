import { FareModels } from "./fare-models";

export class IOTDeviceConfig {
    deviceConfigId: any;
    deviceTarifConfiguration:FareModels = new FareModels();
    facturationStarterDat:any;
    facturationEndDay:any;
    facturationLimitPayDay:any;
}
