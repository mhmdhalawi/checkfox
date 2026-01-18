import { Hono } from "hono";
import { validateZipcode } from "./validators/zipcode";
import { validateOwner } from "./validators/owner";
import { mapLead } from "./mappers/lead";

const app = new Hono();

// Configuration
const BEARER_TOKEN = `${process.env.BEARER_TOKEN}`;
const CUSTOMER_API_URL = `${process.env.API_URL}/${process.env.USER_ID}/`;

// Main webhook - receives leads from Primest API
app.post("/webhook", async (c) => {
  try {
    const lead = await c.req.json();
    console.log("📥 Received lead:", JSON.stringify(lead, null, 2));

    // Filter 1: Validate zipcode
    const zipcodeValidation = validateZipcode(lead);
    if (!zipcodeValidation.valid) {
      return c.json(
        {
          status: "rejected",
          reason: zipcodeValidation.reason,
        },
        400,
      );
    }

    // Filter 2: Validate owner
    const ownerValidation = validateOwner(lead);
    if (!ownerValidation.valid) {
      return c.json(
        {
          status: "rejected",
          reason: ownerValidation.reason,
        },
        400,
      );
    }

    console.log("✅ Lead accepted");

    // Transform data for customer API
    const transformedLead = mapLead(lead, zipcodeValidation.zipcode);

    // Send to customer API
    const response = await fetch(CUSTOMER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedLead),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log("❌ Customer API error:", error);
      return c.json({ status: "error", error }, 500);
    }

    console.log("✅ Sent to customer API");
    return c.json({ status: "success" });
  } catch (error) {
    console.error("❌ Error:", error);
    return c.json({ status: "error", message: String(error) }, 500);
  }
});

// Health check
app.get("/", (c) => {
  return c.json({ status: "ok" });
});

// Export for Bun
export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
