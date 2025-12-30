import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

export const staffService = {
    async getAll() {
        const response = await axios.get(`${API_BASE_URL}/staffs`)
        return response.data
    },
    async getById(id) {
        const response = await axios.get(`${API_BASE_URL}/staffs/${id}`)
        return response.data
    },
    async create(staffData) {
        const response = await axios.post(`${API_BASE_URL}/staffs`, staffData)
        return response.data
    },
    async update(id, staffData){
        const response = await axios.put(`${API_BASE_URL}/staffs/${id}`, staffData)
        return response.data
    },
    async delete(id) {
        const response = await axios.delete(`${API_BASE_URL}/staffs/${id}`)
        return response.data
    }
}