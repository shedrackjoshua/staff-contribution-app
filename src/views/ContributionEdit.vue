<template>
    <div class="contribution-edit">
        <div class="page-header">
            <div class="header-content">
                <div class="breadcrumb">
                    <router-link to="/contributions" class="breadcrumb-link">Contributions</router-link>
                    <span class="breadcrumb-seperator">/</span>
                    <router-link v-if="contribution" :to="`/contributions/${contribution._id}`" class="breadcrumb-link">Details</router-link>
                    <span class="breadcrumb-seperator">/</span>
                    <span class="breadcrumb-current">Edit</span>
                </div>
                <div class="header-main">
                    <div class="header-text">
                        <h1>Edit Contribution</h1>
                        <p>Update Contribution Information</p>
                    </div>
                    <div class="header-actions">
                        <router-link :to="`/contributions/${$router.params.id}`" class="btn btn-secondary">Cancel</router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-container">
            <!-- loading state -->
            <div v-if="loading && !contribution" class="state-message loading">
                <div class="loading-content">
                    <div class="loading spinner"></div>
                    <span>Loading contribution...</span>
                </div>
            </div>

            <!-- error state -->
            <div v-else-if="error" class="state-message error">
                {{ error }}
            </div>

            <!-- edit form -->
            <div v-else-if="contribution" class="form-card">
                <form @submit.prevent="updateContribution" class="contribution-form">
                    <div class="form-sexction">
                        <h3 class="section-title">Contribution Information</h3>

                        <div class="form-grid">
                            <div class="form-group">
                                <label for="staff">Staff*</label>
                                <div class="select-wrapper">
                                    <select id="staff" v-model="staff" required class="form-select" :class="{ 'input-error': errors.staff }">
                                        <option value="">Select Staff</option>
                                        <option v-for="sta in staffs" :key="sta._id" :value="sta._id">{{ sta.name }}</option>
                                    </select>
                                </div>
                                <span v-if="errors.staff" class="error-message">{{ errors.staff }}</span>
                            </div>

                            <div class="form-group">
                                <label for="month" class="form-label">Month*</label>
                                <div class="select-wrapper">
                                    <select id="month" v-model="month" required class="form-select" :class="{ 'input-error': errors.month }">
                                        <option value="">Select Month</option>
                                        <option value="">Select Month</option>
                                        <option value="january">January</option>
                                        <option value="february">February</option>
                                        <option value="march">March</option>
                                        <option value="april">April</option>
                                        <option value="may">May</option>
                                        <option value="june">June</option>
                                        <option value="july">July</option>
                                        <option value="august">August</option>
                                        <option value="september">September</option>
                                        <option value="october">October</option>
                                        <option value="november">November</option>
                                        <option value="december">December</option>
                                    </select>
                                </div>
                                <span v-if="errors.month" class="error-message">{{ errors.month }}</span>
                            </div>

                            <div class="form-group">
                                <label for="amount" class="form-label">Amount*</label>
                                <div class="input-wrapper">
                                    <input id="amount" type="number" v-model="amount" min="0" step="0.01" required class="form-input" :class="{ 'input-error': errors.amount }" placeholder="Enter Contribution Amount">
                                </div>
                                <span v-if="errors.amount" class="error-message">{{ errors.amount }}</span>
                            </div>

                            <div class="form-group">
                                <label for="datePaid" class="form-label">Date Paid*</label>
                                <div class="input-wrapper">
                                    <input id="datePaid" type="date" v-model="datePaid" required class="form-input" :class="{ 'input-error': errors.datePaid }">
                                </div>
                                <span v-if="errors.datePaid" class="error-message">{{ errors.datePaid }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <router-link :to="`/contributions/${$route.params.id}`" class="btn btn-secondary">Cancel</router-link>
                        <button type="submit" class="btn btn-primary" :disabled="submitting">Update Contribution
                            <span v-if="submitting" class="loading-spinner"></span>{{ submitting ? 'Updating...' : 'Update Contribution' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contributionService  } from '../services/contributionService.js'
import { staffService } from '../services/staffService.js'

const route = useRoute()
const router = useRouter()

//form data
const contribution = ref(null)
const staffs = ref([])
const staff = ref('')
const month = ref('')
const amount = ref('')
const datePaid = ref('')

//form state 
const loading = ref(false)
const errors = ref({})
const submitting = ref(false)
const error = ref('')

//load contribution and staffs
const loadData = async () => {
    loading.value = true 
    error.value = ''
    try {
        //load contributions and staffs in parallel
        const [contributionData, staffsData] = await Promise.all([
            contributionService.getById(route.params.id),
            staffService.getAll()
        ])
        contribution.value = contributionData
        staffs.value = staffsData

        //Populate form with existing data
        staff.value = contributionData.staff?._id || contributionData.staff ||''
        month.value = contributionData.month || ''
        amount.value = contributionData.amount || ''
        datePaid.value = contributionData.datePaid ? contributionData.datePaid.split('T')[0] : ''
    } catch (err) {
        error.value = 'Failed to load data'
        console.error('Error loading data:', err)
    } finally {
        loading.value = false
    }
}

//form validation
const validation = () => {
    errors.value = {}

    if (!staff.value){
        errors.value.staff = 'staff is required'
    }
    if (!month.value.trim()){
        errors.value.month = 'Month is required'
    }
    if (!amount.value || amount.value <= 0){
        errors.value.amount = 'Please enter a valid amount'
    }
    if (!datePaid.value){
        errors.value.datePaid = 'Date is required'
    }
    return Object.keys(errors.value).length === 0
}

//Submit form
const updateContribution = async () => {
    if (!validation()) {
        return
    }
    submitting.value = true

    try {
        await contributionService.update(route.params.id, {
            staff: staff.value,
            month: month.value,
            amount: parseFloat(amount.value),
            datePaid: datePaid.value
        })
        //Redirect to detail page on success
        router.push(`/contributions/${route.params.id}`)
    } catch (err){
        if (err.response?.data?.errors) {
            errors.value = err.response.data.errors
        } else {
            alert('Failed to update contribution, please try again.')
        }
        console.error('Error updating contribution:', err)
    } finally {
        submitting.value = false    
    }
}

//load data on component mount
onMounted(loadData)
</script>

<style scoped>
.contribution-edit {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}
.page-header {
    background-color: #f5f5f5;
    padding: 20px;
    border-bottom: 1px solid #ddd;      
}
.content-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}
.form-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.contribution-form {
    display: flex;
    flex-direction: column;
}
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}
.form-group .form-input,
.form-group .form-select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.form-group .form-input.input-error,
.form-group .form-select.input-error {
    border-color: red;
}
.error-message {
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
    margin-left: 8px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>