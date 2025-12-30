<template>
    <div class="staff-contributions">
        <div class="page-header">
            <div class="header-content">
                <div class="breadcrumb">
                    <router-link to="/staffs" class="breadcrumb-link">Staffs</router-link>
                    <span class="breadcrumb-seperator">/</span>
                    <router-link v-if="staff" :to="`/staffs/${staff._id}`" class="breadcrumb-link">{{ staff.name }}</router-link>
                    <span class="breadcrumb-seperator">/</span>
                    <span class="breadcrumb-current">Contributions</span>
                </div>

                <div class="header-main">
                    <div class="header-text">
                        <h1 v-if="staff">{{ staff.name }}'s Contributions</h1>
                        <h1 v-else>Staff Contributions</h1>
                        <p>View all contribution for this staff</p>
                    </div>

                    <div class="header-actions">
                        <router-link to="/contributions/create" class="btn btn-primary">Add Contribution</router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-container">
            <!-- Loading State -->
            <div v-if="loading" class="state-message loading">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <span>Loading Contributions...</span>
                </div>
            </div>
            <!-- Error State -->
             <div v-else-if="error" class="state-message error">
                {{ error }}   
             </div>
             <!-- Staff Info Card -->
             <div v-if="staff" class="staff-info-card">
                <div class="staff-summary">
                    <div class="staff-details">
                        <h2 class="staff-name">{{ staff.name }}</h2>
                        <p class="staff-meta">
                            <span class="department-badge">{{ staff.department }}</span>
                            <span class="phone-number">{{ staff.phone }}</span>
                        </p>
                    </div>
                    
                    <div class="contribution-stats">
                        <div class="stat-item">
                            <span class="stat-value">{{ contributions.length }}</span>
                            <span class="stat-label">Total Contributions</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">#{{ totalAmount.toFixed(2) }}</span>
                            <span class="stat-label">Total Amount</span>
                        </div>
                    </div>
                </div>
             </div>
            <!-- Empty State -->
            <div v-if="!loading && contributions.length === 0" class="state-message empty">
                <div class="empty-content">
                    <h3>No Contributions Found</h3>
                    <p v-if="staff">{{ staff.name }} hasn't made any contributions yet.</p>
                    <router-link to="/contributions/create" class="btn btn-primary">Add First Contribution</router-link>
                </div>
            </div>
            <!-- Contributions Table -->
            <div v-else-if="contributions.length > 0" class="table-container">
                <div class="table-header">
                    <h3>Contribution History</h3>
                    <p>{{ contributions.length }} contribution{{ contributions.length > 1 ? 's' : ''  }} Found</p>
                </div>
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Date Paid</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contribution in contributions" :key="contribution._id">
                            <td class="month-badge">{{ contribution.month }}</td>
                            <td class="amount-cell"># {{ Number(contribution.amount).toFixed(2) }}</td>
                            <td class="date-cell">{{ formatDate(contribution.datePaid) }}</td>
                            <td class="actions-cell">
                                <div class="action-buttons">
                                    <router-link :to="`/contributions/${contribution._id}`" class="btn btn-sm btn-info">View</router-link>
                                    <router-link :to="`/contributions/${contribution._id}/edit`" class="btn btn-sm btn-warning">Edit</router-link>
                                    <button @click="deleteContribution(contribution._id)" class="btn btn-sm btn-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { contributionService } from '../services/contributionService.js'
import { staffService } from '../services/staffService.js'

const route = useRoute()

//Reactive state
const staff = ref(null)
const contributions = ref([])
const loading = ref(false)
const error = ref('')

//computed property for total amount
const totalAmount = computed(() => {
    return contributions.value.reduce((sum, contrib) => sum + Number(contrib.amount), 0)
})

//load staff and their contributions
const loadStaffContributions = async () => {
    loading.value = true
    error.value = ''

    try {
        //load staff detals and contribution in parallel
        const [staffData, contributionsData] = await Promise.all([
            staffService.getById(route.params.staffid),
            contributionService.getByStaffId(route.params.staffid)
        ])

        staff.value = staffData
        contributions.value = contributionsData
    } catch (err){
        error.value = 'Failed to load staff data'
        console.error('Error loading staff data:', err)
    } finally {
        loading.value = false
    }
}

//Delete contribution with confirmation
const deleteContribution = async (contributionID) => {
    if (confirm('Are you sure you want to delete this contribution?')){
        try {
            await contributionService.delete(contributionID)
            //Remove from local array (Optimistic update)
            contributions.value = contributions.value.filter(contrib => contrib._id !== contributionID)
        } catch (err) {
            alert('Failed to delete contribution')
            console.error('Error deleting contribution:', err)
        }
    }
}

//Utility function
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
}

//Load data on component mount
onMounted(loadStaffContributions)
</script>

<style scoped>
.staff-contributions {
    padding: 20px;
}
.page-header {
    margin-bottom: 20px;
}
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.breadcrumb {
    font-size: 0.9rem;
    margin-bottom: 10px;
}
.breadcrumb-link {
    color: #3498db;
    text-decoration: none;
}
.breadcrumb-seperator {
    margin: 0 5px;
    color: #7f8c8d;
}
.breadcrumb-current {
    color: #2c3e50;
    font-weight: bold;
}
.header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.header-text h1 {
    margin: 0;
    font-size: 2rem;
}
.header-text p {
    margin: 0;
    color: #666;
}
.header-actions .btn {
    padding: 10px 15px;
    font-size: 1rem;
}
.content-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.state-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}
.state-message.loading .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.state-message.loading .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.table-container {
    overflow-x: auto;
}
.modern-table {
    width: 100%;
    border-collapse: collapse;
}
.modern-table th,
.modern-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
}
.modern-table th {
    background-color: #f8f9fa;
    font-weight: 600;
}
.month-badge {
    background-color: #e0f7fa;
    color: #00796b;
    padding: 5px 10px;
    border-radius: 12px;
    font-weight: 600;
}
.amount-cell {
    font-weight: 600;
    color: #27ae60;
}
.date-cell {
    color: #34495e;
}
.actions-cell .action-buttons {
    display: flex;
    gap: 5px;
}


</style>
