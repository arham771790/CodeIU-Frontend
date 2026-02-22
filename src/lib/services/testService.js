import { AUTH_SERVICE_URL } from "@/lib/urls";

/**
 * Sample Service to demonstrate POST requests and error handling
 */
export async function samplePostRequest(payload) {
  try {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Extract error code from the standardized backend response
      const errorCode = data.error?.code || "UNKNOWN_ERROR";
      const errorMessage = data.error?.message || "Something went wrong";
      
      console.error(`[POST Error] ${errorCode}: ${errorMessage}`);
      return { success: false, errorCode, message: errorMessage };
    }

    console.log("Request successful: Request received confirmed by backend logs");
    return { success: true, data };
  } catch (error) {
    console.error("Network or parsing error:", error.message);
    return { success: false, message: error.message };
  }
}
