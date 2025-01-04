// Main PackageTracker Class
class PackageTracker {
    constructor() {
        // Initialize storage for packages
        this.packages = JSON.parse(localStorage.getItem('packages')) || [];
        
        // Get all the elements we need to interact with
        this.initializeElements();
        
        // Set up event listeners
        this.initializeEventListeners();
        
        // Initial render of packages and stats
        this.renderPackages();
        this.updateStats();
    }

    initializeElements() {
        this.form = document.querySelector('.quick-add-form');
        this.packageName = document.querySelector('#packageName');
        this.trackingNumber = document.querySelector('#trackingNumber');
        this.carrier = document.querySelector('#carrier');
        this.packageGrid = document.querySelector('#packageGrid');
        this.searchInput = document.querySelector('.search-bar input');
        this.statusFilter = document.querySelector('#statusFilter');
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleAddPackage(e));

        // Search functionality
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // Filter functionality
        this.statusFilter.addEventListener('change', () => this.handleFilter());
    }

    handleAddPackage(e) {
        e.preventDefault();

        // Create new package object
        const newPackage = {
            id: Date.now().toString(),
            name: this.packageName.value || 'Unnamed Package',
            trackingNumber: this.trackingNumber.value,
            carrier: this.carrier.value,
            status: 'pending',
            dateAdded: new Date().toISOString(),
            estimatedDelivery: this.calculateEstimatedDelivery(),
            timeline: [{
                date: new Date().toISOString(),
                status: 'Order Placed',
                location: 'System'
            }]
        };

        // Add to packages array
        this.packages.unshift(newPackage);
        
        // Save and update display
        this.saveToLocalStorage();
        this.renderPackages();
        this.updateStats();
        
        // Reset form and show success message
        this.form.reset();
        this.showNotification('Package added successfully!');
    }

    renderPackages(packagesToRender = this.packages) {
        if (packagesToRender.length === 0) {
            this.packageGrid.innerHTML = `
                <div class="empty-state">
                    <p>No packages found. Add your first package above!</p>
                </div>
            `;
            return;
        }

        this.packageGrid.innerHTML = packagesToRender.map(pkg => `
            <div class="package-card">
                <div class="package-header">
                    <div class="package-title">
                        <h3>${pkg.name}</h3>
                        <span class="tracking-number">${pkg.trackingNumber}</span>
                        <span class="carrier">${pkg.carrier}</span>
                    </div>
                    <div class="status-badge ${pkg.status}">
                        ${pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </div>
                </div>

                <div class="delivery-info">
                    <div class="info-item">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 12v2m-4-2v2m8-2v2M3 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6m-4 0V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/>
                        </svg>
                        <span>Added: ${this.formatDate(pkg.dateAdded)}</span>
                    </div>
                    <div class="info-item">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                        </svg>
                        <span>Estimated Delivery: ${this.formatDate(pkg.estimatedDelivery)}</span>
                    </div>
                </div>

                <div class="package-timeline">
                    <div class="timeline-track"></div>
                    <div class="timeline-items">
                        ${this.renderTimeline(pkg)}
                    </div>
                </div>

                <div class="package-actions">
                    <button onclick="packageTracker.updateStatus('${pkg.id}')" class="action-button">
                        Update Status
                    </button>
                    <button onclick="packageTracker.deletePackage('${pkg.id}')" class="action-button delete">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderTimeline(pkg) {
        return pkg.timeline.map(event => `
            <div class="timeline-item ${event.status === pkg.status ? 'active' : ''}">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <span class="time">${this.formatDate(event.date)}</span>
                    <p>${event.status}</p>
                    ${event.location ? `<span class="location">${event.location}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    updateStatus(id) {
        const pkg = this.packages.find(p => p.id === id);
        if (!pkg) return;

        const statuses = ['pending', 'in-transit', 'delivered'];
        const currentIndex = statuses.indexOf(pkg.status);
        pkg.status = statuses[(currentIndex + 1) % statuses.length];

        pkg.timeline.unshift({
            date: new Date().toISOString(),
            status: pkg.status,
            location: 'Updated via system'
        });

        this.saveToLocalStorage();
        this.renderPackages();
        this.updateStats();
    }

    deletePackage(id) {
        if (!confirm('Are you sure you want to delete this package?')) return;
        
        this.packages = this.packages.filter(p => p.id !== id);
        this.saveToLocalStorage();
        this.renderPackages();
        this.updateStats();
        this.showNotification('Package deleted');
    }

    updateStats() {
        const stats = {
            pending: this.packages.filter(p => p.status === 'pending').length,
            inTransit: this.packages.filter(p => p.status === 'in-transit').length,
            delivered: this.packages.filter(p => p.status === 'delivered').length
        };

        document.getElementById('pendingCount').textContent = stats.pending;
        document.getElementById('inTransitCount').textContent = stats.inTransit;
        document.getElementById('deliveredCount').textContent = stats.delivered;
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filtered = this.packages.filter(pkg => 
            pkg.name.toLowerCase().includes(searchTerm) ||
            pkg.trackingNumber.toLowerCase().includes(searchTerm) ||
            pkg.carrier.toLowerCase().includes(searchTerm)
        );
        this.renderPackages(filtered);
    }

    handleFilter() {
        const status = this.statusFilter.value;
        const filtered = status === 'all' 
            ? this.packages 
            : this.packages.filter(pkg => pkg.status === status);
        this.renderPackages(filtered);
    }

    // Utility Functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    calculateEstimatedDelivery() {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 5) + 3);
        return date.toISOString();
    }

    saveToLocalStorage() {
        localStorage.setItem('packages', JSON.stringify(this.packages));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when the page loads
const packageTracker = new PackageTracker();