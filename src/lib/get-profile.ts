import { Profile } from "../app/profile/page"
import { api } from "./axios";

export const getProfile = async (userId: string) => {
  try {
    const response = await api.get(`/api/v1/users/public_profile/${userId}`);
    const user = response.data;

    if (!user)
      return null;

    // const newProfile: Profile = {
    //   first: user.firstName,
    //   middle: user?.middleName || null,
    //   last: user.lastName,
    //   username: user.username || null,
    //   email: user.email,
    //   discord: user?.discord || null,
    //   major: user?.major || null,
    //   year: user?.year || null,
    //   bio: user?.bio,
    //   linkedin: user?.linkedin || null,
    //   interests: user?.interests || null,
    //   portfolio: user?.websites || null, // Google Drive or direct PDF URL
    //   avatar: user?.avatar || null,
    //   banner: user?.banner || null,
    //   background: user?.background || null,
    //   followers: user?.followers || 0,
    //   following: user?.following || 0,
    //   posts: user?.posts || 0,
    //   avatarPos: user?.avatarPos || null,
    //   bannerPos: user?.bannerPos || null,
    //   backgroundPos: user?.backgroundPos || null,
    //   pronouns: user?.pronouns || null,
    // }; 

    return user;
  } catch {
    return null;
  }
};