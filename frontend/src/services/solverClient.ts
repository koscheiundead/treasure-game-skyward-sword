export async function solve(boardState: any) {
  const res = await fetch("https://localhost:8000/solve-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(boardState)
  });

  return await res.json();
}
