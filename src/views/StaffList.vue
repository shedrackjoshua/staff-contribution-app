<template>
    <div class="staff-list">
        <div class="header">
            <h1>Staffs</h1>
            <router-link to="/staffs/create" class="btn btn-success">Add New Staff</router-link>
        </div>
        <div v-if="loading" class="loading">Loading Staffs...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="staffs.length === 0" class="no-staffs">No staff found.
            <router-link to="/staffs/create">Create The First One!</router-link>
        </div>
        <div v-else class="table-container">
            <table class="staffs-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Phone</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in staffs" :key="s._id">
                        <td>{{ s.name }}</td>
                        <td>{{ s.department }}</td>
                        <td>{{ s.phone }}</td>
                        <td>{{ formatDate(s.createdAt) }}</td>
                        <td class="actions">
                            <router-link :to="`/staffs/${s._id}`" class="btn btn-info btn-sm">View</router-link>
                            <router-link :to="`/staffs/${s._id}/edit`" class="btn btn-warning btn-sm">Edit</router-link>
                            <button @click="deleteStaff(s._id)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { staffService } from '../services/staffService.js'

const router = useRouter()
const staffs = ref([])
const loading = ref(false)
const error = ref('')

const fetchStaffs = async () => {
    loading.value = true
    error.value = ''

    try {
        staffs.value = await staffService.getAll()
    } catch (err) {
        error.value = 'Failed to load staffs'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const deleteStaff = async (id) => {
    if (confirm('Are you sure you want to delete staff?')){
        try {
            await staffService.delete(id)
            staffs.value = staffs.value.filter(st => st._id !== id)
        }catch (err) {
            alert('Failed to delete staff')
            console.error(err)
        }
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
}
onMounted(fetchStaffs)
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}
.table-container{
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.staffs-table {
    width: 100%;
    border-collapse: collapse;
}
.staffs-table th,
.staffs-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
}
.staff-table th{
    background-color: #f8f9fa;
    font-weight: 600;
}
.actions {
    display: flex;
    gap: 0.5rem;
}
.btn {
    padding: 0.375rem 0.75rem;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.3s;
}
.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.btn-info { background-color: #17a2b8; color: white;}
.btn-warning { background-color: #ffc107; color: #212529;}
.btn-danger { background-color: #dc3545; color: white;}
.btn-success { background-color: #28a745; color: white;}

.loading, .no-staff, .error {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}
.error {
    color: #dc3545;
}
</style>