/** Turns your admin password into a hash to paste into .env as ADMIN_PASSWORD_HASH. */
import bcrypt from "bcryptjs";

function askHidden(q: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(q);
    const stdin = process.stdin;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let input = "";
    const onData = (ch: string) => {
      for (const c of ch) {
        if (c === "\r" || c === "\n" || c === "\u0004") {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.off("data", onData);
          process.stdout.write("\n");
          return resolve(input);
        }
        if (c === "\u0003") process.exit(1);
        if (c === "\u007f" || c === "\b") input = input.slice(0, -1);
        else input += c;
      }
    };
    stdin.on("data", onData);
  });
}

const pw = await askHidden("Choose an admin password (typing is hidden): ");
if (pw.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}
const again = await askHidden("Type it again: ");
if (pw !== again) {
  console.error("Passwords didn't match.");
  process.exit(1);
}
const hash = await bcrypt.hash(pw, 12);
console.log("\nPaste this line into your .env file (replace the existing ADMIN_PASSWORD_HASH line):\n");
// Single quotes: bcrypt hashes contain "$" which dotenv would otherwise treat specially.
console.log(`ADMIN_PASSWORD_HASH='${hash}'\n`);
