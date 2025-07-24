import { testConnection } from "../supabase/client"
import * as todoApi from "../supabase/todoApi"

// Debug function to test all Supabase operations
export const runSupabaseTests = async () => {
    console.log("🧪 Starting Supabase tests...")

    try {
        // Test 1: Connection
        console.log("Test 1: Testing connection...")
        const connectionOk = await testConnection()
        console.log("Connection result:", connectionOk)

        // Test 2: Fetch todos
        console.log("Test 2: Fetching todos...")
        const todos = await todoApi.getTodos()
        console.log("Fetched todos:", todos)

        // Test 3: Add todo
        console.log("Test 3: Adding test todo...")
        const newTodo = await todoApi.addTodo({
            task: "Test todo from debug script",
            priority: "high",
        })
        console.log("Added todo:", newTodo)

        // Test 4: Update todo
        if (newTodo) {
            console.log("Test 4: Updating test todo...")
            const updatedTodo = await todoApi.updateTodo(newTodo.id, {
                task: "Updated test todo",
                completed: true,
            })
            console.log("Updated todo:", updatedTodo)

            // Test 5: Delete todo
            console.log("Test 5: Deleting test todo...")
            const deleteResult = await todoApi.deleteTodo(newTodo.id)
            console.log("Delete result:", deleteResult)
        }

        console.log("All tests completed successfully!")
    } catch (error) {
        console.error("Test failed:", error)
    }
}

// Call this function from browser console: window.runSupabaseTests()
if (typeof window !== "undefined") {
    window.runSupabaseTests = runSupabaseTests
}
