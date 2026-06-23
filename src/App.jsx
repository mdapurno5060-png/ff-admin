import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://ff-tournament-vpee.onrender.com";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [tTitle, setTTitle] = useState("");
  const [tFee, setTFee] = useState("");
  const [tPrize, setTPrize] = useState("");
  const [tDate, setTDate] = useState("");

  const [coinEmail, setCoinEmail] = useState("");
  const [coinAmount, setCoinAmount] = useState("");

  /* LOGIN */
  const login = async () => {
    const res = await axios.post(`${API}/login`, { email, password });

    if (!res.data.user) return alert(res.data.message);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setToken(res.data.token);
    setUser(res.data.user);
  };

  /* LOAD DATA */
  const loadData = async () => {
    try {
      const tRes = await axios.get(`${API}/tournaments`, {
        headers: { Authorization: token },
      });

      setTournaments(tRes.data);

      const uRes = await axios.get(`${API}/users`);
      setUsers(uRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(localStorage.getItem("user")));
      loadData();
    }
  }, [token]);

  /* CREATE TOURNAMENT */
  const createTournament = async () => {
    const res = await axios.post(
      `${API}/admin/create-tournament`,
      {
        title: tTitle,
        entryFee: Number(tFee),
        prize: Number(tPrize),
        date: tDate,
      },
      { headers: { Authorization: token } }
    );

    alert(res.data.message);
    loadData();
  };

  /* ADD COINS */
  const addCoins = async () => {
    const res = await axios.post(
      `${API}/admin/add-coins`,
      {
        email: coinEmail,
        coins: Number(coinAmount),
      },
      { headers: { Authorization: token } }
    );

    alert(res.data.message);
    loadData();
  };

  /* LOGIN PAGE */
  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h1>🔥 FF ADMIN PANEL</h1>

          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={login}>LOGIN</button>
        </div>
      </div>
    );
  }

  /* DASHBOARD */
  return (
    <div className="container">
      <h1 className="title">🔥 FF TOURNAMENT ADMIN</h1>

      <div className="grid">

        <div className="card">
          <h2>👤 Admin</h2>
          <p>{user?.username}</p>
          <p>{user?.email}</p>
        </div>

        <div className="card">
          <h2>🏆 Create Tournament</h2>

          <input placeholder="Title" onChange={(e) => setTTitle(e.target.value)} />
          <input placeholder="Entry Fee" onChange={(e) => setTFee(e.target.value)} />
          <input placeholder="Prize" onChange={(e) => setTPrize(e.target.value)} />
          <input placeholder="Date" onChange={(e) => setTDate(e.target.value)} />

          <button onClick={createTournament}>CREATE</button>
        </div>

        <div className="card">
          <h2>💰 Add Coins</h2>

          <input placeholder="User Email" onChange={(e) => setCoinEmail(e.target.value)} />
          <input placeholder="Coins" onChange={(e) => setCoinAmount(e.target.value)} />

          <button onClick={addCoins}>ADD</button>
        </div>

        <div className="card">
          <h2>🏆 Tournaments</h2>

          {tournaments.map((t, i) => (
            <div className="box" key={i}>
              <p>{t.title}</p>
              <p>Fee: {t.entryFee}</p>
              <p>Prize: {t.prize}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>👥 Users</h2>

          {users.map((u, i) => (
            <div className="box" key={i}>
              <p>{u.username}</p>
              <p>{u.email}</p>
              <p>Coins: {u.coins}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
