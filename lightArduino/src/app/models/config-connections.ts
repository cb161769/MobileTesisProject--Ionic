import { ConfigDaysModel } from "./config-days-model";

/**
 * Configuration Connections Model
 */
export class ConfigConnections {
    deviceId:string;
    configurationTitle:string;
    InitialTime: Date;
    FinalTime: Date;
    isActive:boolean;
    maximumKilowattPerDay: number;
    registeredAt:Date;
    updatedAt:Date;
    days: ConfigDaysModel[];

}
