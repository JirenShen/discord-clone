import {db} from "./db";
import { currentUser, auth } from '@clerk/nextjs/server';

export const initialProfile = async () => {
    // const authObject = await auth();
    // console.log('=== Clerk Auth 调试信息 ===');
    // console.log(authObject);
    // console.log('===========================');
    const user = await currentUser()
    const { redirectToSignIn } = await auth();
    if (user===null || !user.id) {
    return redirectToSignIn({ returnBackUrl: '/' });
    }
    const profile = await db.profile.findUnique({
    where: {
        userId: user.id,
    },
    });

    if(profile) return profile;
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `{user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        }
    });
    return newProfile;
}