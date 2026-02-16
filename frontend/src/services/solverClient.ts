import axios from 'axios';

export async function solve(boardState: any) {
  const { data } = await axios.post("http://127.0.0.1:5000/solve-step", boardState);

  return data;
}
