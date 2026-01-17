export function validateZipcode(lead: any): {
  valid: boolean;
  zipcode: string;
  reason?: string;
} {
  const zipcode =
    lead.zipcode || lead.zip || lead.postal_code || lead.plz || "";

  console.log(`🔍 Checking zipcode: "${zipcode}"`);

  if (!zipcode.toString().startsWith("66")) {
    console.log(`❌ Rejected: Wrong zipcode (got: ${zipcode})`);
    return {
      valid: false,
      zipcode,
      reason: `Zipcode not in 66*** region (got: ${zipcode})`,
    };
  }

  return { valid: true, zipcode };
}
