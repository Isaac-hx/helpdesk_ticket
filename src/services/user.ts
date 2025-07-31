import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);


export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error

  // Hapus cookies dari client
  document.cookie = "user_id=; Max-Age=0; path=/"
  document.cookie = "email=; Max-Age=0; path=/"
  document.cookie = "access_token=; Max-Age=0; path=/"
  document.cookie = "refresh_token=; Max-Age=0; path=/"
}
export async function register(email: string, password: string,name:string) {
  // Register user via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) throw error

  // Ambil user ID dari hasil registrasi
  const userId = data.user?.id

  if (!userId) throw new Error("User ID not found after registration.")

  // Insert ke tabel 'profiles' (atau sesuaikan nama tabelmu)
  const { error: error2 } = await supabase.from("profiles").insert([
    {
      user_id:userId,      // biasanya FK ke tabel auth.users
      // kamu bisa tambahkan kolom default lain di sini
      name:name
    },
  ])

  if (error2) throw error2

  return data
}

export async function login(email:string,password:string){
    const {data,error} = await supabase.auth.signInWithPassword({
        email:email,
        password:password
    })
    const access_token:string = String(data.session?.access_token)
    const refresh_token:string = String(data.session?.refresh_token)
    await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: refresh_token,
    })
    // Set access and refresh tokens in cookies (expires in 7 days)
    document.cookie = `access_token=${data.session?.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    document.cookie = `refresh_token=${data.session?.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    document.cookie = `user_id=${data.session?.user.id}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    document.cookie = `email=${data.user?.email}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    
    if (error) {throw error}

    return data
}