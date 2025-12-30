<template>
    <div class="staff-create">
        <div class="header">
            <h1>Add New Staff</h1>
            <router-link to="/staffs" class="btn btn-secondary">back To List</router-link>
        </div>
        <div class="form-container">
            <form @submit.prevent="createStaff" class="staff-form">
                <div class="form-group">
                    <label for="name">Name*</label>
                    <input type="text" id="Name" v-model="form.name" required :class="{ error: errors.name }" placeholder="Enter Staff Name">
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" :class="{ error: errors.department}" v-model="form.department" required>
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
                    <label for="Phone">Phone*</label>
                    <input type="tel" id="phone" v-model="form.phone" required :class="{ error: errors.phone }" placeholder="Enter Phone Number">
                    <span v-if="errors.phone" class="error-message" >{{ errors.phone }}</span>
                </div>
                <div v-if="errors.phone" class="alert alert-danger">{{ error }}</div>
                <div v-if="success" class="alert alert-success">{{ success }}</div>

                <div class="form-actions">
                    <router-link to="/staffs" class="btn btn-secondary">Cancel</router-link>
                    <button type="submit" :disabled="submitting" class="btn btn-primary">{{ submitting? 'Creating...' :'Create Staff' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { staffService } from '../services/staffService.js'

const router = useRouter()

const form = ref({
    name: '',
    department: '',
    phone: ''
})

const errors = ref({})
const submitting = ref(false)
const error = ref('')
const success = ref('')

const validateForm = () => {
    const newErrors = {}

    if (!form.value.name.trim()){
        newErrors.name = 'Name is required'
    }
    if (!form.value.department.trim()){
        newErrors.department = 'Department is required'
    }
    if (!form.value.phone.trim()){
        newErrors.phone = 'Phone is required'
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(form.value.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
    }
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
}

const createStaff = async () => {
    if (!validateForm()) return

    submitting.value = true
    error.value = ''
    success.value = ''

    try {
        await staffService.create(form.value)
        success.value = 'Staff created successfully!'

        setTimeout (() => {
            router.push('/staffs')
        }, 1500)
    } catch (err){
        error.value = err.response?.data?.message || 'Failed to create staff'
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
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
    margin-bottom: 1.5rem;
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
    margin-top: 1rem;
    border-radius: 4px;
}
.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
.forms-action {
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
    transition: background-color 0.3s;
}
.btn-primary {
    background-color: #007bff;
    color: white;
}
.btn-primay:hover:not(:disabled) {
    background-color: #0056b3;
}
.btn-secondary {
    background-color: #6c757d;
    color: white;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>