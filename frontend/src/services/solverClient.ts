import axios from 'axios';

export async function solve(boardState: any) {
  console.log("board state");
  console.log(boardState);
  const { data } = await axios.post("http://127.0.0.1:5000/solve-step", boardState);
  console.log("data");
  console.log(data);
  if (data.status === "inconsistent") {
    return {}
  } else {
    return data
  }
}
