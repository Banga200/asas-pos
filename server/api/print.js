import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from "node-thermal-printer";
import path from "path";
// import fs from "fs";
import { exec } from "child_process";
// import print from "pdf-to-printer";
export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  
  // const filePath = path.join(".", "public", "casher.pdf");
  // fs.writeFileSync(filePath, (file[0]).toString())
  const buffer = await Buffer.from(body[0].data);
  // const printers = print.getPrinters().then((result) => {
  //       return result
  //   })
  //   return printers
  // await fs.createWriteStream(filePath).write(buffer);
 // Replace with the actual file path
// Use print command to print the file

  // let printer = new ThermalPrinter({
  //   type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
  //   interface: "printer:BIXOLON SRP-350plusIII", // Printer interface
  //   characterSet: CharacterSet.WPC1256_ARABIC, // Printer character set
  //   removeSpecialCharacters: false, // Removes special characters - default: false:
  //   driver: 'printqueue.inf',
  //   options: {
  //     // Additional options
  //     timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
  //   },
  // });
  // printer.alignCenter();
  // let isConnected = await printer.isPrinterConnected();
  // console.log(isConnected)
  // // await printer.printImage('./public/images/cacher-invoice.png');
  // printer.print("Hello World"); 
  // // await printer.printQR('Mohammed');
  // printer.cut();
  // await printer.execute();
});
