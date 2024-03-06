import {
    ThermalPrinter,
    PrinterTypes,
    CharacterSet,
  } from "node-thermal-printer";
  import path from "path";
  import fs from "fs";
  import print from "pdf-to-printer";
  export default defineEventHandler(async (event) => {

      const body = await readMultipartFormData(event);
      const filePath = path.join(".", "public", "invoice.pdf");
      const buffer = await Buffer.from(body[0].data);
      // await fs.writeFileSync(filePath, (body[0].data).toString());
      await fs.createWriteStream(filePath).write(buffer);
      // جلب اسماء الطابعات 

      // const printers = print.getPrinters().then((result) => {
      //   return result
      // });
      
      // return printers
     print.print('./public/invoice.pdf').then(console.log)
    //  fs.unlinkSync('./public/invoice.pdf');
    //================ NODE-Thermal ===============

    //   let printer = new ThermalPrinter({
    //     type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
    //     interface: "//./USB", // Printer interface
    //     characterSet: CharacterSet.WPC1256_ARABIC, // Printer character set
    //     removeSpecialCharacters: false, // Removes special characters - default: false
    //     options: {
    //       // Additional options
    //       timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
    //     },
    //   });
    //   printer.alignCenter();
    // //   await printer.raw(buffer)
    //   let isConnected = await printer.isPrinterConnected();
    //   console.log(isConnected)
    //   await printer.printImageBuffer(buffer);
      
    //   try {
    //     await printer.execute();
    //     return {status: "Succesfully"};
    //   } catch (error) {
    //     console.log(error)
    //     return error
    //   }
      
  });