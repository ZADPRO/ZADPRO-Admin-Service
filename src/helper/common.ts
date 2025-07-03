export const getAdjustedTime = (): string => {
  const serverTime = new Date();
  serverTime.setMinutes(serverTime.getMinutes() + 330);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-IN", options).format(serverTime);
};

// export const CurrentTime = (): string => {
//   const systemTime = new Date();

//   const options: Intl.DateTimeFormatOptions = {
//     day: "numeric",
//     month: "numeric",
//     year: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: true,
//   };
//   return new Intl.DateTimeFormat("en-IN", options).format(systemTime);
// };

export const CurrentTime = (): string => {
  const today = new Date();
  return today.toISOString().replace("T", " ").slice(0, 19); // "YYYY-MM-DD HH:mm:ss"
};



export function generateFileName(): string {
  const timestamp = Date.now(); // Milliseconds since Jan 1, 1970
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${timestamp}${random}`; // e.g., "17132654798341234"
}

export function generatePassword(length: number = 8): string {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const symbols = "@#$%";
  const allChars = upperCase + lowerCase
  + symbols;

  let password = "";
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
