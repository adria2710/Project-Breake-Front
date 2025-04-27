const API_URL = 'http://localhost:4000/api/auth';

export const loginRequest = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error('Credenciales inválidas');
    }

    const data = await res.json();
    return data;
};
