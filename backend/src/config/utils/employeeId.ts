import { v4 as uuidv4 } from "uuid";

export default function generateRandomID(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomNumbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  let result = `ID-MY-${randomNumbers}`;

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
const randomID: string = generateRandomID();
console.log(randomID);
