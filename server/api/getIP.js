import {networkInterfaces} from "os";
var networkInterface = networkInterfaces();
export default defineEventHandler(async (event) => {
    let getPrinters = 0
    let address_Ip = null
    for (let index = 0; index < networkInterface.Ethernet.length; index++) {
        const ip = networkInterface.Ethernet[index];
        if (ip.family === "IPv4") {
            address_Ip = ip.address
        }
        
    }

    return networkInterface;
})