import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000/api/users';

  // Obtener usuarios al cargar la app
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.age) {
      setError('Nombre y edad son obligatorios');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age)
        })
      });

      if (!res.ok) throw new Error('Error al crear usuario');

      setForm({ name: '', age: '' });
      fetchUsers(); // recargar lista
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el usuario');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Mini API REST - Usuarios</h1>
      <p>Frontend React consumiendo la API de Node + Express + SQLite.</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Crear usuario</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Nombre:{' '}
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Edad:{' '}
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
            </label>
          </div>
          <button type="submit">Crear</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </section>

      <section>
        <h2>Lista de usuarios</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : users.length === 0 ? (
          <p>No hay usuarios cargados.</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                #{u.id} - {u.name} ({u.age} años)
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
