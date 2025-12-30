<template>
    <div class="contribution-details">
        <div class="page-header">
            <div class="header-content">
                <div class="bread-crumb">
                    <router-link to="/contributions" class="breadcrumb-link">Contributions</router-link>
                    <span class="breadcrumb-seperator">/</span>
                    <span class="breadcrumb-current">Details</span>
                </div>

                <div class="header-main">
                    <div class="header-text">
                        <h1>Contribution Details</h1>
                        <p>View contribution information</p>
                    </div>
                    <div class="header-actions">
                        <router-link to="/contributions" class="btn btn-secondary">Back to list</router-link>
                        <router-link v-if="contribution" :to="`/contributions/${contribution._id}/edit`" class="btn btn-primary">Edit Contribution</router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-container">
            <!-- loading state -->
            <div v-if="loading" class="state-message loading">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <span>Loading contribution details...</span>
                </div>
            </div>
            <!-- error state -->
            <div v-else-if="error" class="state-message error">
                {{ error }}
            </div>

            <!-- contribution details -->
             <div v-else-if="contribution" class="detail-card">
                <div class="card-header">
                    <h2>Contribution Information</h2>
                </div>
                <div class="details-grid">
                    <div class="detail-item">
                        <label for="datail-label">Staff</label>
                        <div class="detail-value staff-info">
                            <span class="staff-name">{{ contribution.staff?.name || 'Unknown Staff' }}</span>
                            <span class="staff-department">{{ contribution.staff?.department || ''}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="detail-label">Month:</label>
                        <div class="detail-value month-badge">
                            {{ contribution.month }}
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="detail-label">Amount:</label>
                        <div class="detail-value amount-badge">
                            #{{ Number(contribution.amount).toFixed(2) }}
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="detail-label">Date Paid:</label>
                        <div class="detail-value">
                            {{ formatDate(contribution.datePaid) }}
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="detail-label">Last Updated:</label>
                        <div class="detail-value date-display">
                            {{ formatDate(contribution.updatedAt) }}
                        </div>
                    </div>
                </div>

                <div class="card-action">
                    <router-link :to="`/contributions/${contribution._id}/edit`" class="btn btn-warning">Edit Contributions</router-link>
                    <button @click="deleteContribution" class="btn btn-danger">Delete Contribution</button>
                </div>
             </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contributionService } from '../services/contributionService.js'

const route = useRoute()
const router = useRouter()

//Reactive state
const contribution = ref(null)
const loading = ref(false)
const error = ref('')

//Fetch contribution details
const fetchContribution = async () => {
    loading.value = true
    error.value = ''

    try {
        contribution.value = await contributionService.getById(route.params.id)
    } catch (err){
        error.value = 'Failed to load contribution details'
        console.error('Error fetching contribution details:', err)
    } finally {
        loading.value = false
    }
}

//Delete contribution
const deleteContribution = async () => {
    if (confirm('Are you sure you want to delete this contribution?')) {
        try {
            await contributionService.delete(contribution.value._id)
            router.push('/contributions')
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

onMounted(fetchContribution)
</script>

<style scoped>
.contribution-details .detail-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.contribution-details .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
}
.contribution-details .detail-item {
    display: flex;
    flex-direction: column;
}
.contribution-details .detail-label {
    font-weight: bold;
    margin-bottom: 5px;
}
.contribution-details .detail-value {
    font-size: 1rem;
}
.contribution-details .month-badge, .contribution-details .amount-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 12px;
    background-color: #f0f0f0;
    font-weight: bold;
}
.contribution-details .amount-badge {
    background-color: #d1e7dd;
    color: #0f5132;
}
.contribution-details .staff-info {
    display: flex;
    flex-direction: column;
}
.contribution-details .staff-name {
    font-weight: bold;
}
.contribution-details .staff-department {
    font-size: 0.9rem;
    color: #666;
}
.contribution-details .card-action {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

</style>