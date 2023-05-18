import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface Todo {
    id: number;
    title: string;
    done: boolean;
}

const todos = [] as Todo[];

export default function Home({
    searchParams: { errors },
}: {
    searchParams: { errors: string };
}) {
    const addTodo = async (data: FormData) => {
        "use server";
        const title = data.get("title");
        if (!title) {
            redirect("/?errors=Title is required");
        }
        const newTodo = {
            id: todos.length + 1,
            title: title.toString(),
            done: false,
        };
        todos.push(newTodo);
        redirect("/");
    };
    const removeTodo = async (data: FormData) => {
        "use server";
        const id = data.get("id");
        if (!id) return;
        const index = todos.findIndex(
            (todo) => todo.id === parseInt(id.toString())
        );
        if (index === -1) return;
        todos.splice(index, 1);
        revalidatePath("/");
    };
    const toggleTodo = async (data: FormData) => {
        "use server";
        const id = data.get("id");
        if (!id) return;
        const index = todos.findIndex(
            (todo) => todo.id === parseInt(id.toString())
        );
        if (index === -1) return;
        todos[index].done = !todos[index].done;
        revalidatePath("/");
    };
    return (
        <main>
            <h1>Todo List</h1>
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={todo.done ? "todo done" : "todo"}
                    >
                        {todo.title}
                        <form action={toggleTodo}>
                            <input type="hidden" name="id" value={todo.id} />
                            <button className="done button">Done</button>
                        </form>
                        <form action={removeTodo}>
                            <input type="hidden" name="id" value={todo.id} />
                            <button className="button">X</button>
                        </form>
                    </li>
                ))}
            </ul>
            <form action={addTodo}>
                <input
                    type="text"
                    placeholder="Add a new todo..."
                    name="title"
                />
                <button type="submit">Add</button>
                {errors && <p className="error">{errors}</p>}
            </form>
        </main>
    );
}
