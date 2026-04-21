import { api } from '../services/api';

async function test() {
  try {
    await api.signOut();
    console.log("Signing in as marcelo...");
    const auth = await api.signIn('marcelo@traveliz.mx', 'Traveliz2026!');
    if (auth.error) {
      console.error("Auth err:", auth.error.message); return;
    }
    console.log("User UID:", auth.data.user?.id);
    const profile = await api.getUserProfile(auth.data.user?.id!);
    console.log("Returned profile:", JSON.stringify(profile, null, 2));
  } catch (err) {
    console.error("Test error:", err);
  }
}
test();
