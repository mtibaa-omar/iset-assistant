import { supabase, supabaseUrl } from "../supabase";

export const authAPI = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    });
    if (error) throw new Error(error.message);

    if (
      data?.user &&
      (!data.user.identities || data.user.identities.length === 0)
    ) {
      throw new Error("User already registered");
    }

    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw new Error(error.message);
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  getUser: async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);
    return data?.user;
  },

  updateCurrentUser: async ({ fullName, password, avatar, level, speciality }) => {
    let updateData = { data: {} };
    
    if (fullName) updateData.data.full_name = fullName;
    if (level) updateData.data.level = level;
    if (speciality) updateData.data.speciality = speciality;
    if (password) updateData.password = password;

    if (Object.keys(updateData.data).length > 0 || updateData.password) {
      const { data, error } = await supabase.auth.updateUser(updateData);
      if (error) throw new Error(error.message);
      if (!avatar) return data;
    }

    if (!avatar) {
      const { data } = await supabase.auth.getUser();
      return data;
    }

    const { data: currentUser } = await supabase.auth.getUser();

    //2. Upload avatar image
    const fileName = `avatar-${currentUser.user.id}-${Math.random()}`;

    const { error: errorStorage } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar);

    if (errorStorage) {
      console.error(errorStorage);
      throw new Error(errorStorage.message);
    }

    //3. Update file name
    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
    if (error2) {
      console.error(error2);
      throw new Error(error2.message);
    }
    return updatedUser;
  },

  verifyOtp: async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    if (error) throw new Error(error.message);
    return data;
  },

  resendOtp: async (email) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) throw new Error(error.message);
  },
  getData: async () => {
    const [depts, specs, lvls, specLvls] = await Promise.all([
      supabase.from('departments').select('*'),
      supabase.from('specialties').select('*'),
      supabase.from('levels').select('*'),
      supabase.from('specialty_levels').select('*'),
    ]);

    if (depts.error) throw new Error(depts.error.message);
    if (specs.error) throw new Error(specs.error.message);
    if (lvls.error) throw new Error(lvls.error.message);
    if (specLvls.error) throw new Error(specLvls.error.message);

    return {
      departments: depts.data || [],
      specialties: specs.data || [],
      levels: lvls.data || [],
      specialtyLevels: specLvls.data || [],
    };
  }
};
