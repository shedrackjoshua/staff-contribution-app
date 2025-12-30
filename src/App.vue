<script setup>

</script>
<template>
  <div id="app">
    <div class="app-layout">
      <!-- Vertical Sidebar Navigation -->
       <nav class="sidebar">
        <div class="sidebar-header">
          <router-link to="/" class="nav-brand">
            <span class="brand-icon" :icon="['fas', 'user']"></span>
            <span class="brand-text">Staff Management</span>
          </router-link>
        </div>
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li>
            <router-link to="/staffs" class="nav-link">Staffs</router-link>
          </li>
          <li>
            <router-link to="/staffs/create" class="nav-link nav-link-primary">Add Staff</router-link>
          </li>
          <li>
            <router-link to="/contributions" class="nav-link">Contributions</router-link>  
          </li>
          <li>
            <router-link to="/contributions/create" class="nav-link nav-link-primary">Add Contribution</router-link>
          </li>
        </ul>
       </nav>
       <!-- Main Content Area -->
       <main class="main-content">
        <router-view />
       </main>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}
.navbar {
  background-color: #343a40;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nav-container{
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}
.nav-brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}
.nav-link {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.3s;
}
.nav-link:hover,
.nav-link.router-link-active{
  color: white;
}
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Sidebar layout styles */
.app-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 250px;
  background: linear-gradient(180deg,#0f172a 0%, #111827 100%);
  color: #fff;
  padding: 1.25rem;
  box-shadow: 2px 0 10px rgba(2,6,23,0.6);
  display: flex;
  flex-direction: column;
}
.sidebar .sidebar-header {
  display:flex;
  align-items:center;
  gap:0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.sidebar .brand-icon{ /* small square badge for branding */
  width:44px;height:44px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(90deg,#7c3aed,#06b6d4);font-weight:700;color:#fff;font-size:0.95rem
}
.sidebar .brand-text{ font-weight:700; font-size:1rem }
.sidebar .brand-sub{ font-size:0.8rem; color:rgba(255,255,255,0.65) }
.sidebar .nav-menu{
  margin-top:1rem;
  display:block;
  padding-left:0;
}
.sidebar .nav-menu li{ list-style:none; margin-bottom:0.6rem }
.sidebar .nav-link{
  display:flex;align-items:center;gap:0.75rem;
  color:rgba(255,255,255,0.85);
  padding:0.6rem 0.75rem; border-radius:8px;
  text-decoration:none; transition: all .12s ease;
}
.sidebar .nav-link:hover{ transform:translateX(6px); background: rgba(255,255,255,0.02) }
.sidebar .nav-link .icon{ width:22px; text-align:center }
.sidebar .nav-link.nav-link-primary{ background: linear-gradient(90deg,#10b981,#06b6d4); color:#fff }
.sidebar .nav-link.router-link-active{ background: rgba(255,255,255,0.06); color:#fff; font-weight:600 }

/* responsive: collapse sidebar on narrow screens */
@media (max-width: 820px){
  .sidebar{ width:72px; padding:0.75rem }
  .sidebar .brand-text, .sidebar .brand-sub, .sidebar .nav-link .link-text{ display:none }
  .sidebar .nav-link{ justify-content:center }
}

.main-content {
  flex: 1;
  background: transparent;
  padding: 2rem;
}
</style>
