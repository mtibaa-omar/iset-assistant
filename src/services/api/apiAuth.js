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
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw new Error(error.message);
    return data;
  },

  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('level_id, specialty_id')
      .eq('id', userId)
      .maybeSingle();
    
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
    
    const user = data?.user;
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, level_id, specialty_id')
      .eq('id', user.id)
      .maybeSingle();

    return { 
      ...user, 
      profile_role: profile?.role || 'student',
      level_id: profile?.level_id,
      specialty_id: profile?.specialty_id,
    };
  },

  updateCurrentUser: async ({ fullName, password, avatar, level, speciality }) => {
    const { data: currentUser } = await supabase.auth.getUser();

    let authUpdateData = { data: {} };
    
    if (fullName) authUpdateData.data.full_name = fullName;
    if (password) authUpdateData.password = password;

     if (avatar) {
      const fileName = `avatar-${currentUser.user.id}-${Math.random()}`;
      const { error: errorStorage } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);

      if (errorStorage) throw new Error(errorStorage.message);
      
      authUpdateData.data.avatar_url = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
    }

    const profileUpdate = {};
    if (fullName) profileUpdate.full_name = fullName;
    if (level) profileUpdate.level_id = level;
    if (speciality) profileUpdate.specialty_id = speciality;

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', currentUser.user.id);

      if (profileError) throw new Error(profileError.message);
    }

    if (Object.keys(authUpdateData.data).length > 0 || authUpdateData.password) {
      const { data, error } = await supabase.auth.updateUser(authUpdateData);
      if (error) throw new Error(error.message);
      return data;
    }

    const { data } = await supabase.auth.getUser();
    return data;
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

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw new Error(error.message);
    return data;
  },
  getData: async () => {
    const [depts, specs, lvls, specLvls] = await Promise.all([
      supabase.from('departments').select('*'),
      supabase.from('specialties').select('*'),
      supabase.from('levels').select('*').order('name', { ascending: true }),
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
