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

export async function getItemListById(id: string) {
  const file = fs.existsSync("database.json");

  if (!file) {
    fs.writeFileSync("database.json", JSON.stringify([], null, 2));
    return [];
  }

  const db = JSON.parse(fs.readFileSync("database.json", "utf-8"));

  return db.find((item: { id: string }) => item.id === id);
}
