// _test-script.ts
import "dotenv/config"; // To load .env.local variables
import getListNasabah from "../src/features/polis/actions/get-nasabah-list";

async function main() {
  console.log("Running getListNasabah...");
  try {
    const nasabahList = await getListNasabah();
    console.log("✅ Success! Fetched data:");
    console.table(nasabahList); // console.table is great for arrays of objects
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
}

main();
