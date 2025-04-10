import { Markdownify } from "./helper/markdownify.js";

async function testPdfConversion() {
  try {
    const pdfUrl =
      "file:///Users/hanqizheng/Downloads/GSG_Cashback_DE_Packages.pdf";
    console.log("Converting PDF:", pdfUrl);

    const result = await Markdownify.toMarkdown(pdfUrl);
    console.log("Conversion successful!");
    console.log("Output file:", result.path);
    console.log("Content:", result.text);
  } catch (error) {
    console.error("Error:", error);
  }
}

testPdfConversion();
