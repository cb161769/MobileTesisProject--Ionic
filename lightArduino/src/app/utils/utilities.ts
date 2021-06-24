/**
 * @author Claudio Raul Brito Mercedes
 * @description this enum represents the number of devices Names
 */
export enum DevicesEnum{
    DeviceOne = 'Conexion 1',
    DeviceTwo = 'Conexion 2',
    DeviceThree = 'Conexion 3',
    DeviceFour = 'Conexion 4',
}
export const IotTopics = {
    DeviceOne: {
        turnOn: '/turnOnDeviceOne',
        turnOff: '/turnOffDeviceOne',
    },
    DeviceTwo: {
        turnOn: '/turnOnDeviceTwo',
        turnOff: '/turnOffDeviceTwo',
    },
    DeviceThree: {
        turnOn: '/turnOnDeviceThree',
        turnOff: '/turnOffDeviceThree',
    },
    DeviceFour: {
        turnOn: '/turnOnDeviceFour',
        turnOff: '/turnOffDeviceFour',
    },
    AllDevices: {
        turnOn: '/turnOnAllDevices',
        turnOff: '/turnOffAllDevices',
    },
};