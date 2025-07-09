
export async function registerUser({ nombre, correo, password }) {
  const res = await fetch("http://127.0.0.1:5000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, password }),
  });
  return res.json();
}
