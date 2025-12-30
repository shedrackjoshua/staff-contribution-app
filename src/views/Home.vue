<template>
    <div class="home">
        <h1>Welcome to Staff Management System</h1>
        <p>Manage your staff and their contribution efficiently</p>
        <div class="quick-action">
            <router-link to="/staffs" class="btn btn-primary">View All Staffs</router-link>
            <router-link to="/staffs/create" class="btn btn-success">Add New Staff</router-link>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.home {
    text-align: center;
    padding: 4rem ;
}
.home h1{
    color: #343a40;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}
.home p {
    color: #6c757d;
    font-size: 1.2rem;
    margin-bottom: 3rem;
}
.quick-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}
.btn {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 5px;
    font-weight: 500;
    transition: background-color 0.3s;
}
.btn-primary {
    background-color: #700bff;
    color: white;
}
.btn-primary:hover {
    background-color: #0056b3;
}
.btn-success {
    background-color: #28a745;
    color: white;
}
.btn-success:hover {
    background-color: #1e7e34;
}

</style>

