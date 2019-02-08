import * as fs from "fs";
import * as recursive from "recursive-readdir";
import * as mkdir from "make-dir";

(async () => {
  const files = await recursive("content").catch(console.log);
  if (!files) return;

  const mds = files.filter(file => file.slice(-2) === "md" && file);

  console.log(mds);

  mds.forEach(async md => {
    const file = fs.readFileSync("./" + md, "utf-8");

    const body = file.split("---");
    if (!body[1]) return;
    const line = body[1].split("\n").filter(s => s.length > 0);
    const json: { [key: string]: string } = {};
    line.forEach(item => {
      const arr = item.split(":");
      json[arr[0]] = arr[1];
    });
    const arr = md.split("/");
    const filename: any = arr.pop();

    let path = "";
    arr.forEach(s => (path += s + "/"));
    await mkdir("output/" + path);
    fs.writeFileSync(
      "output/" + path + "/" + filename.slice(0, -2) + "json",
      JSON.stringify(json)
    );
  });
})();
