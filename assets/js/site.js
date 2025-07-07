function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });
    // Show selected page
    var page = document.getElementById(pageId);
    if (page) page.classList.add('active');
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (event && event.target) event.target.classList.add('active');
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
if (typeof document !== 'undefined') {
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (!sidebar.contains(e.target) && e.target !== menuBtn) {
                sidebar.classList.remove('open');
            }
        }
    });
} 