export function mapLead(lead: any, zipcode: string) {
  // Extract data from questions object
  const questions = lead.questions || {};

  // Map the lead data to customer API format
  const transformedLead = {
    lead: {
      email: lead.email || "",
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      street: lead.street || "",
      housenumber: "", // Not provided in Primest data
      postcode: zipcode,
      city: lead.city || "",
      phone: lead.phone || "",
      country: "de", // Assuming Germany
    },
    product: {
      name: "solar", // Required - assuming product name is "solar"
    },
    lead_attributes: {
      // Energy consumption
      solar_energy_consumption:
        questions["Wie hoch schätzen Sie ihren Stromverbrauch?"] ||
        questions["Wie hoch ist Ihr aktueller Stromverbrauch?"] ||
        "",

      // Property type
      solar_property_type:
        questions["Wo möchten Sie die Solaranlage installieren?"] || "",

      // Owner status
      solar_owner:
        questions["Sind Sie Eigentümer der Immobilie?"] === "Ja" ||
        questions["Sind Sie Eigentümer der Immobilie?"] === "true" ||
        questions["Sind Sie der Eigentümer der Immobilie?"] === "Ja" ||
        questions["Sind Sie der Eigentümer der Immobilie?"] === "true"
          ? "Ja"
          : "Nein",

      // Roof type
      solar_roof_type:
        questions["Welche Dachform haben Sie auf Ihrem Haus?"] || "",

      // Roof age
      solar_roof_age:
        questions["Wie alt ist Ihr Dach?"] === "Vor 1990"
          ? "Älter als 30 Jahre"
          : questions["Wie alt ist Ihr Dach?"] === "Nach 1990"
            ? "Jünger als 30 Jahre"
            : questions["Wie alt ist Ihr Dach?"] || "",

      // Power storage
      solar_power_storage:
        questions["Stromspeicher gewünscht"] ||
        questions["Sind Sie auch an einem Stromspeicher interessiert?"] ||
        "",

      // Usage type
      solar_usage: questions["Wie möchten Sie den Solarstrom nutzen?"] || "",

      // Roof material
      solar_roof_material: questions["Dachmaterial"] || "",

      // South location / orientation
      solar_south_location: questions["Dachausrichtung"] || "",

      // Roof area
      solar_area: questions["Dachfläche"] || "",

      // Source
      source: "primest",
    },
    meta_attributes: {
      unique_id: lead.created_at ? `primest_${lead.created_at}` : "",
      optin: "true", // Assuming leads from Primest have opted in
    },
  };

  console.log("🔄 Transformed:", JSON.stringify(transformedLead, null, 2));

  return transformedLead;
}
