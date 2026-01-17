export function mapLead(lead: any, zipcode: string) {
  // TODO: Update this based on customer_attribute_mapping.json
  const mappedLead = {
    firstName: lead.first_name || lead.firstName || "",
    lastName: lead.last_name || lead.lastName || "",
    email: lead.email || "",
    phone: lead.phone || "",
    zipCode: zipcode,
    city: lead.city || "",
    isOwner: true,
  };

  console.log("🔄 Transformed:", mappedLead);

  return mappedLead;
}
