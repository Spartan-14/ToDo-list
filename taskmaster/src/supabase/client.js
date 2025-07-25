import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug logging for environment variables
console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing")
console.log("Supabase Key:", supabaseAnonKey ? "Set" : "Missing")

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables!")
    console.error("Make sure you have REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // Since we're not using auth yet
    },
})

// Test connection function
export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from("todos").select("count", { count: "exact", head: true })
        if (error) {
            console.error("Connection test failed:", error)
            return false
        }
        console.log("Supabase connection successful")
        return true
    } catch (err) {
        console.error("Supabase connection failed:", err)
        return false
    }
}
