export default function generateRandomTID(): string {
  const length = 12;
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "PROID-";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const randomTID: string = generateRandomTID();
console.log(randomTID);
