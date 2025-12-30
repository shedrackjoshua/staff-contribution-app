<template>
    <div class="contribution-list">
        <div class="page-header">
            <div class="header-content">
                <div class="header-text">
                    <h1>All Contributions</h1>
                    <p>Manage Staff Contributions</p>
                </div>
                <router-link to="/contributions/create" class="btn btn-primary">Add Contribution</router-link>
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
            <!-- Empty State -->
             <div v-else-if="contributions.length == 0" class="state-message empty">
                <div class="empty-content">
                    <h3>No Contributions Found</h3>
                    <p>Start by adding your first contribution.</p>
                    <router-link to="/contributions/create" class="btn btn-primary">Add First Contribution</router-link>
                </div>
             </div>
            <!-- Data Table -->
             <div v-else class="table-container">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>Staff</th>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Date Paid</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr  v-for="contribution in contributions" :key="contribution._id">
                            <td>{{ contribution.staff?.name || 'Unknown' }}</td>
                            <td>{{ contribution.month }}</td>
                            <td class="amount">#{{ Number(contribution.amount).toFixed(2) }}</td>
                            <td>{{ formatDate(contribution.datePaid) }}</td>
                            <td class="actions">
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
import { ref, onMounted } from 'vue'
import { contributionService } from '../services/contributionService.js'

//Reactive state
const contributions = ref([])
const loading = ref(false)
const error = ref('')

//Fetch contributions from API
const fetchContributions = async () => {
    loading.value = true
    error.value = ''

    try {
        contributions.value = await contributionService.getAll()
    } catch (err) {
        error.value = 'Failed to load contributions'
        console.error('Error fetching contributions:', err)
    } finally {
        loading.value = false
    }
}
//Delete contributions with confirmation
const deleteContribution = async (id) => {
    if (confirm('Are you sure you want to delete this contribution?')) {
        try {
            await contributionService.delete(id)
            contributions.value = contributions.value.filter(c => c._id !== id)
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
//Life circle hook - fetch contributions on component mount
onMounted(fetchContributions)

</script>

<style scoped>
.contribution-list {
    padding: 20px;
}
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.header-content {
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
    text-align: left;
    border-bottom: 1px solid #dee2e6;
}
.modern-table th {
    background-color: #f8f9fa;
    font-weight: 600;
}
.amount {
    font-family: monospace;
}
.actions .action-buttons {
    display: flex;
    gap: 5px;
}


</style>
