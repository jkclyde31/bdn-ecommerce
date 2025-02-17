import { NextRequest, NextResponse } from 'next/server';

interface SendMessageRequestBody {
  message: string;
}

interface FacebookApiResponse {
  error?: {
    message: string;
    type: string;
    code: number;
  };
  recipient_id?: string;
  message_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to send message');
    
    const body: SendMessageRequestBody = await request.json();
    console.log('Request body:', body);
    const { message } = body;

    if (!message) {
      console.error('No message provided in request');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Your Facebook credentials
    const PAGE_ACCESS_TOKEN = "EAAHVbU8TLvcBOw24Cmkx1uxAjgbupbQWXSZARV3ompZAoXdnYPBM8yVpZB8U1lXeOmvQ9SAX4W8eVbmoUZABJHuUfg75BqyCcHiU5VrpgIAffSQVg0c9xWUGQQmRUARTpKVVaZBNtgV2vLooAfdr1RJL04QCF2prAbsYuJ2RShaZCSv206HlTU3ZCb3QHr5PEBG3pz2iU58X6NFFJVOmZCYMD0ev";
    const RECIPIENT_PSID = "553876564479542"; // The PSID of the recipient

    if (!PAGE_ACCESS_TOKEN || !RECIPIENT_PSID) {
      console.error('Missing Facebook credentials');
      return NextResponse.json(
        { error: 'Configuration error: Missing Facebook credentials' },
        { status: 500 }
      );
    }

    console.log('Attempting to send message to Facebook API...');
    
    // Construct the URL with the access token as a query parameter
    const fbUrl = `https://graph.facebook.com/v22.0/me/conversations?access_token=${PAGE_ACCESS_TOKEN}`;

    const fbBody = {
      recipient: {
        id: RECIPIENT_PSID
      },
      message: {
        text: message
      }
    };
    
    console.log('Facebook request body:', JSON.stringify(fbBody, null, 2));

    const response = await fetch(fbUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fbBody)
    });

    console.log('Facebook API response status:', response.status);

    const data: FacebookApiResponse = await response.json();
    console.log('Facebook API response data:', data);

    if (data.error) {
      console.error('Facebook API error:', data.error);
      return NextResponse.json(
        { 
          error: 'Facebook API error',
          details: data.error 
        },
        { status: 500 }
      );
    }

    console.log('Message sent successfully');
    return NextResponse.json(
      { 
        success: true,
        message: "Message sent successfully",
        messageId: data.message_id 
      }
    );

  } catch (error) {
    console.error('Detailed error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}