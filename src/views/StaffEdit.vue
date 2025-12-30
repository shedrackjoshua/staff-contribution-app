<template>
    <div class="staff-edit">
        <div class="header">
            <h1>Edit Staff</h1>
            <div class="header-actions">
                <router-link :to="`/staffs/${route.params.id}`" class="btn btn-info">View Details</router-link>
                <router-link to="/staffs" class="btn btn-secondary">Back to List</router-link>
            </div>
        </div>
        <div v-if="loading" class="loading">Loading Staff...</div>
        <div v-else-if="error && !staff" class="error">{{ error }}</div>

        <div v-else-if="staff" class="form-container">
            <form @submit.prevent="updateStaff" class="staff-form">
                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" id="name" v-model="form.name" required :class="{ error: errors.name }" placeholder="Enter staff name">
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" v-model="form.department" required :class="{ error: errors.name }">
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                    </select>
                    <span v-if="errors.department" class="error-message">{{ errors.department }}</span>
                </div>
                <div class="form-group">
                    <label for="phone">Phone*</label>
                    <input type="tel" id="phone" v-model="form.phone" required :class="{ error: errors.phone }" placeholder="Enter phone number">
                    <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                </div>

                <div v-if="error" class="alert alert-danger">{{ error }}</div>
                <div v-if="success" class="alert alert-success">{{ success }}</div>

                <div class="form-action">
                    <router-link :to="`/staffs/${route.params.id}`" class="btn btn-secondary">Cancel</router-link>
                    <button type="submit" :disabled="submitting" class="btn btn-primary">
                        {{ submitting? 'Updating...' :'Update staff' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { staffService } from '../services/staffService';

const route = useRoute()
const router = useRouter()

const staff = ref(null)
const form = ref({
    name: '',
    department: '',
    phone: ''
})

const errors = ref({})
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref('')

const fetchStaff = async () => {
    loading.value = true
    error.value = ''

    try {
        staff.value = await staffService.getById(route.params.id)

        //populate form with staff data
        form.value.name = staff.value.name
        form.value.department = staff.value.department
        form.value.phone = staff.value.phone
    } catch (err){
        error.value = 'Staff not found'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const validateForm = () => {
    const newErrors = {}

    if(!form.value.name.trim()) {
        newErrors.name = 'Name is required'
    }
    if(!form.value.department.trim()) {
        newErrors.department = 'Department is required'
    }
    if(!form.value.phone.trim()) {
        newErrors.phone = 'Phone is required'
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(form.value.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
    }
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
}

const updateStaff = async () => {
    if (!validateForm()) return

    submitting.value = true
    error.value = ''
    success.value = ''

    try {
        await staffService.update(route.params.id, form.value)
        success.value = 'Staff updated successfully!'

        setTimeout(() => {
            router.push(`/staffs/${route.params.id}`)
        }, 1500)
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to update staff'
    } finally {
        submitting.value = false 
    }
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
.header-actions {
    display: flex;
    gap: 1rem;
}
.form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.staff-form {
    display: flex;
    flex-direction: column;
}
.form-group {
    margin-bottom: 1.5rem;
}
.form-group label {
    display: block;
    margin-top: 0.5rem;
    font-weight: 600;
    color: #333;
}
.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}
.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
.form-group input.error,
.form-group select.error {
    border-color: #dc3545;
}
.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
.alert {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
}
.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
.alert-success {
    background-color: #4dedda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}
.btn {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-colr 0.3s;
}
.btn-primary {
    background-color: #007bff;
    color: white;
}
.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
}
.btn-secondary {
    background-color: #6c757d;
    color: white;
}
.btn-info {
    background-color: #17a2b8;
    color: white;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not allowed;
}
.loading, .error {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}
.error {
    color: #6c757d;
}
</style>