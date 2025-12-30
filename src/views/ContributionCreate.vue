<template>
    <div class="create-contribution">
        <div class="form-header">
            <h1>Add New Contribution</h1>
            <p>Record staff contribution details</p>
        </div>
        <div class="form-card">
            <form @submit.prevent="createContribution" class="contribution-form">
                <div class="form-row">
                    <label for="staff">Staff*</label>
                    <select name="" id="staff" v-model="staff" required :class="{ 'error': errors.staff }">
                        <option value="">Select Staff</option>
                        <option v-for="sta in staffs" :key="sta._id" :value="sta._id">{{ sta.name }}</option>
                    </select>
                    <span v-if="errors.staff" class="error-text">{{ errors.staff }}</span>
                </div>

                <div class="form-row">
                    <label for="month">Month*</label>
                    <select id="month" v-model="month" required :class="{ 'error': errors.month }">
                        <option value="">Select Month</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                    <span v-if="errors.month" class="error-text">{{ errors.month }}</span>
                </div>

                <div class="form-row">
                    <label for="amount">Amount*</label>
                    <input id="amount" type="number" v-model="amount" min="0" step="0.01" required :class="{ 'error': errors.amount }" placeholder="Enter Contribution Amount">
                    <span v-if="errors.amount" class="error-text">{{ errors.amount }}</span>
                </div>
                <div class="form-row">
                    <label for="datePaid">Date Paid*</label>
                    <input id="datePaid" type="date" v-model="datePaid" required :class="{ 'error': errors.datePaid }">
                    <span v-if="errors.datePaid" class="error-text">{{ errors.datePaid }}</span>
                </div>
                <div class="form-actions">
                    <router-link to="/contributions" class="btn btn-secondary">Cancel</router-link>
                    <button type="submit" :disabled="submitting" class="btn btn-primary"><span v-if="submitting" class="loading-spinner"></span>{{ submitting ? 'Submitting...' : 'Create Contribution' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { contributionService } from '../services/contributionService.js'
import { staffService } from '../services/staffService.js'

const router = useRouter()

//form data using ref
const staff = ref('')
const month = ref('')
const amount = ref('')
const datePaid = ref('')

//form state
const staffs = ref([])
const errors = ref({})
const submitting = ref(false)

//load staffs for dropdown
const loadStaffs = async () => {
    try {
        staffs.value = await staffService.getAll()
    } catch (err){
        console.error('Error loading staffs:', err)
    }
}
//form validation
const validateForm = () => {
    const newErrors = {}

    if (!staff.value){
        errors.value.staff = 'Staff is required'
    }
    if (!month.value.trim()){
        errors.value.month = 'Month is required'
    }
    if (!amount.value || isNaN(amount.value) || Number(amount.value) <= 0){
        errors.value.amount = 'Please enter a valid amount'
    }
    if (!datePaid.value){
        errors.value.datePaid = 'Date Paid is required'
    }
    return Object.keys(errors.value).length === 0
}
//Submit form
const createContribution = async () => {
    if (!validateForm()) {
        return
    }
    submitting.value = true
    try {
        await contributionService.create({
            staff: staff.value,
            month: month.value,
            amount: parseFloat(amount.value),
            datePaid: datePaid.value
        })
        //Redirect to contributions list on success
        router.push('/contributions')
    } catch (err){
        if (err.response?.data?.errors) {
            errors.value = err.response.data.errors
        } else {
            alert('Failed to create contribution, please try again.')
        }
        console.error('Error creating contribution:', err)
    } finally {
        submitting.value = false
    }
}

//load staffs on mount
onMounted(loadStaffs)
</script>

<style scoped>
.create-contribution {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}
.form-header {
    margin-bottom: 20px;
}
.form-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.contribution-form .form-row {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}
.contribution-form .form-row label {
    margin-bottom: 5px;
    font-weight: bold;
}
.contribution-form .form-row input,
.contribution-form .form-row select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.contribution-form .form-row input.error,
.contribution-form .form-row select.error {
    border-color: red;
}
.error-text {
    color: red;
    font-size: 0.875rem;
    margin-top: 5px;
}
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}
.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>