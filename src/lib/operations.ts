import fs from "fs";

export async function addItems(data: {
  id: string;
  items: { name: string; amount: string }[];
}) {
  const file = fs.existsSync("database.json");

  if (!file) {
    fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
  }

  const db = JSON.parse(fs.readFileSync("database.json", "utf-8"));

  db.push(data);

  fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
}
