import { IOTDeviceConfig } from './iotdevice-config';
import { IOTRelays } from './iotrelays';
export class IOTDevice {
    deviceId?:any;
    deviceName:string;
    userName:string;
    deviceIp:string;
    creationDeviceDate?:Date;
    updateDeviceDate?:Date;
    deviceStatus:string;
    relays?:IOTRelays[];
    configuration?:IOTDeviceConfig;
}
