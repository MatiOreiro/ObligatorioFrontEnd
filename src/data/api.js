import axios from 'axios'

const api = axios.create({
    baseURL: 'https://obligatorio-five.vercel.app/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api;

/*
https://obligatorio-five.vercel.app/v1
http://localhost:3000/v1
*/