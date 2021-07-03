import { ConfigConnections } from './config-connections';
import { ConfigDaysModel } from './config-days-model';
/**
 * Configuration Device Model
 */
export class ConfigDeviceModel {
    configurationId: string;
    deviceId: string;
    configurationName: string;
    status: boolean;
    configurationDays: ConfigDaysModel[];
    connectionsConfigurations: ConfigConnections[];
    configurationMaximumKilowattsPerDay: number;
    registeredAt: Date;
    updatedAt: Date;

}
