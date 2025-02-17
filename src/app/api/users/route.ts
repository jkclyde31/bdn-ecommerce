// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { wixClientServer } from '../../../../lib/wixClientServer';
import { members } from '@wix/members';

export async function GET() {
  try {
    const wixClient = await wixClientServer();


    // Fetch the current user with full details
    const user = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    // Return successful response with user data
    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // Return null in case of an error
    return NextResponse.json({ user: null });
  }
}