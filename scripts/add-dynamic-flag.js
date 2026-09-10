const fs = require("fs");
const path = require("path");

function addDynamic(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      addDynamic(full);
    } else if (item === "route.ts") {
      let content = fs.readFileSync(full, "utf8");
      if (!content.includes('export const dynamic = "force-dynamic"')) {
        content = 'export const dynamic = "force-dynamic";\n' + content;
        fs.writeFileSync(full, content, "utf8");
        console.log("Added dynamic to:", full);
      }
    }
  }
}

addDynamic("./src/app/api");
console.log("Done updating API route dynamic flags.");
