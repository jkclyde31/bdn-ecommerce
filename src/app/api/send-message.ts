import { NextApiRequest, NextApiResponse } from "next";

// Define the expected request body structure
interface SendMessageRequestBody {
  message: string;
}

// Define the structure of the Facebook API response
interface FacebookApiResponse {
  error?: {
    message: string;
    type: string;
    code: number;
  };
  recipient_id?: string;
  message_id?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract the message from the request body
  const { message }: SendMessageRequestBody = req.body;

  // Replace these with your actual Facebook Page Access Token and Page ID
  const PAGE_ACCESS_TOKEN = "EAAHVbU8TLvcBO2tIdXCZBYHj8ToIXjdFJCg5RYNkDnt8zYlUODJdLBSJAwaZAJpQnvxCY250tzxdSTqxjeF7WocOX9Y04ZC3mtbxx6RJkHKTqyxGzooeEzdifNmT23ZB5OBvVerQTFgmAfBLJljotEEs4oqEvbPlVRplEyp7aHUZAsxZBWM4ZAnz0LdripsoJB1rQZDZD";
  const PAGE_ID = "553780231155842";

  // Validate Facebook credentials
  if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
    return res.status(500).json({ message: "Facebook credentials missing" });
  }

  try {
    // Send the message to Facebook Messenger
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/conversations?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_type: "UPDATE",
          recipient: {
            id: PAGE_ID, // Send to your page
          },
          message: {
            text: message,
          },
        }),
      }
    );

    // Parse the Facebook API response
    const data: FacebookApiResponse = await response.json();

    // Handle errors from the Facebook API
    if (data.error) {
      console.error("Failed to send Messenger notification:", data.error);
      return res.status(500).json({ message: "Failed to send message" });
    }

    // Return success response
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error sending Messenger notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


