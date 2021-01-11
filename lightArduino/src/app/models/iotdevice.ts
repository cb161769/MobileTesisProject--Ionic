import { IOTDeviceConfig } from './iotdevice-config';
import { IOTRelays } from './iotrelays';
export class IOTDevice {
    deviceId?:any;
    deviceName:string;
    deviceUserName:string;
    deviceIp:string;
    creationDeviceDate?:Date;
    updateDeviceDate?:Date;
    deviceStatus:string;
    deviceRelays?:IOTRelays[];
    deviceConfiguration?:IOTDeviceConfig[]
}
