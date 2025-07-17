import { supabase } from "./client"

// Get all todos
export const getTodos = async () => {
    try {
        console.log(" API: Fetching todos from Supabase...")

        const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false })

        if (error) {
            console.error(" API: Fetch todos error:", error)
            throw error
        }

        console.log(" API: Raw todos from Supabase:", data)

        // Transform data to match your app's expected format
        const transformedTodos = data.map((todo) => ({
            id: todo.id,
            task: todo.task,
            completed: todo.completed,
            is_editing: todo.is_editing,
            created_at: todo.created_at,
        }))

        console.log(" API: Transformed todos:", transformedTodos)
        return transformedTodos
    } catch (error) {
        console.error(" API: getTodos failed:", error)
        throw error
    }
}

// Add a new todo
export const addTodo = async (task) => {
    try {
        console.log(" API: Adding todo:", task)

        const { data, error } = await supabase
            .from("todos")
            .insert([
                {
                    task,
                    completed: false,
                    is_editing: false,
                },
            ])
            .select()

        if (error) {
            console.error(" API: Add todo error:", error)
            throw error
        }

        console.log(" API: Todo added successfully:", data[0])
        return data[0]
    } catch (error) {
        console.error(" API: addTodo failed:", error)
        throw error
    }
}

// Update todo
export const updateTodo = async (id, updates) => {
    try {
        console.log(" API: Updating todo:", id, updates)

        const { data, error } = await supabase.from("todos").update(updates).eq("id", id).select()

        if (error) {
            console.error(" API: Update todo error:", error)
            throw error
        }

        console.log(" API: Todo updated successfully:", data[0])
        return data[0]
    } catch (error) {
        console.error(" API: updateTodo failed:", error)
        throw error
    }
}

// Delete todo
export const deleteTodo = async (id) => {
    try {
        console.log(" API: Deleting todo:", id)

        const { error } = await supabase.from("todos").delete().eq("id", id)

        if (error) {
            console.error(" API: Delete todo error:", error)
            throw error
        }

        console.log(" API: Todo deleted successfully:", id)
        return true
    } catch (error) {
        console.error(" API: deleteTodo failed:", error)
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
