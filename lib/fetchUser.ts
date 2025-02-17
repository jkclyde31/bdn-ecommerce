import { wixClientServer } from "../lib/wixClientServer";
import { members } from "@wix/members";

const FetchUser = async () => {
  try {
    const wixClient = await wixClientServer();

    // Fetch the current user with full details
    const user = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    // Return the user object
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);

    // Return null in case of an error
    return null;
  }
};

export default FetchUser;