import getCurrentDateTimeAsString from "../dateTimeConverter";



describe("getCurrentDateTimeAsString", () => {
  test("returns a UTC date-time string in the correct format", () => {
    console.log("\n🕒 Testing getCurrentDateTimeAsString Function 🕒");
    console.log("-------------------------------------------");

    // Call the function
    const result = getCurrentDateTimeAsString();

    // Log the result for visibility
    console.log(`📅 Generated Date-Time String: ${result}`);

    // Detailed assertions with informative console logs
    console.log("\n📋 Performing Validation Checks:");



    // Check format using regex
    console.log("1. Checking date-time format...");
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+00:00$/;
    expect(result).toMatch(regex);
    console.log("   ✅ Format matches YYYY-MM-DD HH:MM:SS+00:00");

    // Parse the result and validate as a date
    console.log("2. Parsing result as a Date object...");
    const parsedDate = new Date(result);
    expect(parsedDate).toBeInstanceOf(Date);
    expect(isNaN(parsedDate.getTime())).toBe(false);
    console.log("   ✅ Successfully parsed as a valid Date");

    // Check UTC offset
    console.log("3. Verifying UTC offset...");
    expect(result.endsWith("+00:00")).toBe(true);
    console.log("   ✅ UTC offset is +00:00");

    // Additional information about the generated date
    console.log("\n📊 Additional Date Information:");
    console.log(`   • Year: ${parsedDate.getUTCFullYear()}`);
    console.log(`   • Month: ${parsedDate.getUTCMonth() + 1}`);
    console.log(`   • Day: ${parsedDate.getUTCDate()}`);
    console.log(`   • Hours: ${parsedDate.getUTCHours()}`);
    console.log(`   • Minutes: ${parsedDate.getUTCMinutes()}`);
    console.log(`   • Seconds: ${parsedDate.getUTCSeconds()}`);

    console.log("\n✨ Test Completed Successfully! ✨");
  });
});