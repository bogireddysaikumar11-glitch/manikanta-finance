const fs = require("fs");
const path = require("path");

function fixEncoding(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== "node_modules" && file !== ".next") fixEncoding(full);
    } else if (
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js") ||
      file.endsWith(".json") ||
      file.endsWith(".css") ||
      file.endsWith(".mjs")
    ) {
      const buf = fs.readFileSync(full);
      let content = "";
      if (buf[0] === 0xff && buf[1] === 0xfe) {
        // UTF-16 LE
        content = buf.toString("utf16le");
        fs.writeFileSync(full, content, "utf8");
        console.log("Fixed UTF-16 LE -> UTF-8:", full);
      } else if (buf[0] === 0xfe && buf[1] === 0xff) {
        // UTF-16 BE
        content = buf.toString("utf16be");
        fs.writeFileSync(full, content, "utf8");
        console.log("Fixed UTF-16 BE -> UTF-8:", full);
      } else if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        // UTF-8 BOM
        content = buf.slice(3).toString("utf8");
        fs.writeFileSync(full, content, "utf8");
        console.log("Removed UTF-8 BOM:", full);
      }
    }
  }
}

fixEncoding("./src");
fixEncoding("./prisma");
console.log("Encoding normalization complete.");
