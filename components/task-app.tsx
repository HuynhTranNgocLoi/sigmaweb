"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function TaskApp() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("tasks")
      .select("id,title,completed,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTasks(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    const { data, error } = await supabase
      .from("tasks")
      .insert({ title: title.trim() })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setTasks((current) => [data, ...current]);
      setTitle("");
    }

    setSaving(false);
  }

  async function toggleTask(task: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  async function deleteTask(id: number) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Supabase Tasks</h1>
        <p>Next.js → Supabase → GitHub Actions → Vercel</p>
      </header>

      <section className="card">
        <form className="form" onSubmit={addTask}>
          <input
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nhập công việc..."
            maxLength={200}
          />
          <button className="button" disabled={saving}>
            {saving ? "Đang thêm..." : "Thêm"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="empty">Đang tải dữ liệu...</div>
        ) : tasks.length === 0 ? (
          <div className="empty">Chưa có công việc nào.</div>
        ) : (
          <div className="list">
            {tasks.map((task) => (
              <div className="task" key={task.id}>
                <label className="task-left">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span className={`task-title ${task.completed ? "done" : ""}`}>
                    {task.title}
                  </span>
                </label>

                <button
                  className="delete"
                  onClick={() => deleteTask(task.id)}
                  type="button"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="footer">
        Dữ liệu được lưu trực tiếp trong PostgreSQL của Supabase.
      </p>
    </main>
  );
}