export function validateOwner(lead: any): { valid: boolean; reason?: string } {
  // Check direct fields
  const directOwner =
    lead.is_owner || lead.owner || lead.homeowner || lead.eigentuemer;

  // Check questions object (German)
  const ownerQuestion =
    lead.questions?.["Sind Sie der Eigentümer der Immobilie?"] ||
    lead.questions?.["Sind Sie Eigentümer der Immobilie?"];

  const isOwner =
    directOwner ||
    ownerQuestion === "true" ||
    ownerQuestion === "Ja" ||
    ownerQuestion === "ja" ||
    ownerQuestion === true ||
    false;

  console.log(
    `🔍 Checking owner status: "${isOwner}" (direct: ${directOwner}, question: ${ownerQuestion})`
  );

  if (
    !isOwner ||
    isOwner === "false" ||
    isOwner === "no" ||
    isOwner === "nein" ||
    isOwner === "Nein" ||
    ownerQuestion === "false" ||
    ownerQuestion === "Nein" ||
    ownerQuestion === "nein"
  ) {
    console.log(`❌ Rejected: Not owner (got: ${isOwner})`);
    return {
      valid: false,
      reason: `Not house owner (got: ${isOwner})`,
    };
  }

  return { valid: true };
}
