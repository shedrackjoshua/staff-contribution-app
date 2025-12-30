<template>
    <div class="staff-details">
        <div class="header">
            <h1>Staff Details</h1>
            <div class="header-actions">
                <router-link :to="`/staffs/${staff?._id}/edit`" class="btn btn-warning">Edit</router-link>
                <router-link to="/staffs" class="btn btn-secondary">Back to List</router-link>
            </div>
        </div>
        <div v-if="loading" class="loading">Loading staff details</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="staff" class="staff-card">
            <div class="staff-info">
                <div class="info-row">
                    <label>Name:</label>
                    <span>{{ staff.name }}</span>
                </div>
                <div class="info-row">
                    <label>Department:</label>
                    <span class="department-badge">{{ staff.department }}</span>
                </div>
                <div class="info-row">
                    <label>Phone:</label>
                    <span>{{ staff.phone }}</span>
                </div>
                <div class="info-row">
                    <label>Staff ID</label>
                    <span class="staff-id">{{ staff._id }}</span>
                </div>
                <div class="info-row">
                    <label>Created:</label>
                    <span>{{ formatDate(staff.createdAt) }}</span>
                </div>
                <div v-if="staff.updatedAt !== staff.createdAt" class="info-row">
                    <label>Last Updated:</label>
                    <span>{{ formatDate(staff.updatedAt) }}</span>
                </div>
            </div>
            <div class="actions-section">
                <button @click="deleteStaff" class="btn btn-danger">Delete Staff</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { staffService } from '../services/staffService.js'

const route = useRoute()
const router = useRouter()

const staff = ref(null)
const loading = ref(false)
const error = ref('')

const fetchStaff = async () => {
    loading.value = true
    error.value = ''

    try {
        staff.value = await staffService.getById(route.params.id)
    } catch (err){
        error.value = 'Staff not found'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const deleteStaff = async () => {
    if (confirm(`Are you sure you want to delete ${staff.value.name}?`)){
        try {
            await staffService.delete(staff.value._id)
            router.push('/staffs')
        } catch (err) {
            alert('Failed to delete staff')
            console.error(err)
        }
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
}

onMounted(fetchStaff)
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}
.haeder-actions {
    display: flex;
    gap: 1rem;
}
.staff-card {
    background: white;
    padding: 2rem;
    border-radius: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
}
.staff-info {
    margin-bottom: 2rem;
}
.info-row {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
}
.info-row label {
    font-weight: 600;
    color: #333;
    min-width: 150px;
}
.info-row span {
    color: #666;
}
.department-badge {
    background-color: #007bff;
    color-scheme: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
}
.staff-id {
    font-family: monospace;
    background-color: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
}
.actions-section {
    border-top: 1px solid #dee2e6;
    padding-top: 2rem;
}
.btn {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}
.btn-warning {
    background-color: #ffc107;
    color: #212529;
}
.btn-secondary {
    background-color: #6c757d;
    color: white;
}
.btn-danger {
    background-color: #dc3545;
    color: white;
}
.loading, .error {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}
.error {
    color: #dc3545;
}

</style>