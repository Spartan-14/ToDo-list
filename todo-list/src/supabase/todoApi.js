import { supabase } from "./client"

// Get all todos (including soft-deleted for admin purposes)
export const getTodos = async (includeDeleted = false) => {
    try {
        console.log("🔄 API: Fetching todos from Supabase...")

        let query = supabase.from("todos").select("*")

        if (!includeDeleted) {
            // Only get non-deleted todos by default
            query = query.eq("is_deleted", false)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) {
            console.error("❌ API: Fetch todos error:", error)
            throw error
        }

        console.log("✅ API: Raw todos from Supabase:", data)

        // Transform data to match your app's expected format
        const transformedTodos = data.map((todo) => ({
            id: todo.id,
            task: todo.task,
            completed: todo.completed,
            is_editing: todo.is_editing,
            priority: todo.priority,
            created_at: todo.created_at,
            updated_at: todo.updated_at,
            is_deleted: todo.is_deleted || false,
            deleted_at: todo.deleted_at,
        }))

        console.log("✅ API: Transformed todos:", transformedTodos)
        return transformedTodos
    } catch (error) {
        console.error("❌ API: getTodos failed:", error)
        throw error
    }
}

// Add a new todo with priority
export const addTodo = async (todoData) => {
    try {
        console.log("🔄 API: Adding todo:", todoData)

        const now = new Date().toISOString()

        const { data, error } = await supabase
            .from("todos")
            .insert([
                {
                    task: todoData.task,
                    completed: false,
                    is_editing: false,
                    priority: todoData.priority || null,
                    is_deleted: false,
                    updated_at: now,
                },
            ])
            .select()

        if (error) {
            console.error("❌ API: Add todo error:", error)
            throw error
        }

        console.log("✅ API: Todo added successfully:", data[0])
        return data[0]
    } catch (error) {
        console.error("❌ API: addTodo failed:", error)
        throw error
    }
}

// Update todo (including priority and updated_at)
export const updateTodo = async (id, updates) => {
    try {
        console.log("🔄 API: Updating todo:", id, updates)

        const updatesWithTimestamp = {
            ...updates,
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase.from("todos").update(updatesWithTimestamp).eq("id", id).select()

        if (error) {
            console.error("❌ API: Update todo error:", error)
            throw error
        }

        console.log("✅ API: Todo updated successfully:", data[0])
        return data[0]
    } catch (error) {
        console.error("❌ API: updateTodo failed:", error)
        throw error
    }
}

// NEW: Soft delete todo
export const softDeleteTodo = async (id) => {
    try {
        console.log("🔄 API: Soft deleting todo:", id)

        const now = new Date().toISOString()

        const { data, error } = await supabase
            .from("todos")
            .update({
                is_deleted: true,
                deleted_at: now,
                updated_at: now,
            })
            .eq("id", id)
            .select()

        if (error) {
            console.error("❌ API: Soft delete todo error:", error)
            throw error
        }

        console.log("✅ API: Todo soft deleted successfully:", data[0])
        return data[0]
    } catch (error) {
        console.error("❌ API: softDeleteTodo failed:", error)
        throw error
    }
}

// NEW: Restore soft-deleted todo
export const restoreTodo = async (id) => {
    try {
        console.log("🔄 API: Restoring todo:", id)

        const now = new Date().toISOString()

        const { data, error } = await supabase
            .from("todos")
            .update({
                is_deleted: false,
                deleted_at: null,
                updated_at: now,
            })
            .eq("id", id)
            .select()

        if (error) {
            console.error("❌ API: Restore todo error:", error)
            throw error
        }

        console.log("✅ API: Todo restored successfully:", data[0])
        return data[0]
    } catch (error) {
        console.error("❌ API: restoreTodo failed:", error)
        throw error
    }
}

// NEW: Permanently delete todo (hard delete)
export const permanentlyDeleteTodo = async (id) => {
    try {
        console.log("🔄 API: Permanently deleting todo:", id)

        const { error } = await supabase.from("todos").delete().eq("id", id)

        if (error) {
            console.error("❌ API: Permanent delete todo error:", error)
            throw error
        }

        console.log("✅ API: Todo permanently deleted:", id)
        return true
    } catch (error) {
        console.error("❌ API: permanentlyDeleteTodo failed:", error)
        throw error
    }
}

// NEW: Get soft-deleted todos (for trash view)
export const getDeletedTodos = async () => {
    try {
        console.log("🔄 API: Fetching deleted todos...")

        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .eq("is_deleted", true)
            .order("deleted_at", { ascending: false })

        if (error) {
            console.error("❌ API: Fetch deleted todos error:", error)
            throw error
        }

        console.log("✅ API: Deleted todos fetched:", data)
        return data
    } catch (error) {
        console.error("❌ API: getDeletedTodos failed:", error)
        throw error
    }
}

// Toggle complete status
export const toggleComplete = async (id, completed) => {
    return updateTodo(id, { completed: !completed })
}

// Set edit mode
export const setEditMode = async (id, isEditing) => {
    return updateTodo(id, { is_editing: isEditing })
}
