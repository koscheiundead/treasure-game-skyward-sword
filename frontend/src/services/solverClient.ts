import axios from 'axios';

export async function solve(boardState: any) {
  const res = await axios.post("https://localhost:8000/solve-step", {
    body: JSON.stringify(boardState)
  });

  return await res.json();
}
