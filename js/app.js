document.addEventListener("DOMContentLoaded", function () {
    // Fake package data (simulates how real tracking would work)
    const fakePackages = [
        { id: "1Z999AA10123456784", carrier: "UPS", status: "In Transit", eta: "March 21, 2025" },
        { id: "9400110200881234567890", carrier: "USPS", status: "Out for Delivery", eta: "Today" }
    ];

    const trackingInput = document.getElementById("trackingInput");
    const carrierSelect = document.getElementById("carrierSelect");
    const trackButton = document.querySelector(".track-button");
    const packageGrid = document.getElementById("packageGrid");

    // Simulate auto-filling tracking number in the tutorial
    function autofillTracking() {
        trackingInput.value = fakePackages[0].id;
        carrierSelect.value = fakePackages[0].carrier.toLowerCase();
    }

    // Fake tracking submission
    function addFakePackage() {
        const trackingNumber = trackingInput.value;
        const carrier = carrierSelect.value;

        if (!trackingNumber || !carrier) {
            showNotification("Please enter a tracking number and select a carrier.", "error");
            return;
        }

        // Simulate a new package being added to the tracking list
        const newPackage = {
            id: trackingNumber,
            carrier: carrier.toUpperCase(),
            status: "Tracking Created",
            eta: "Estimated in 2-3 days"
        };

        fakePackages.push(newPackage);
        renderPackages();
        showNotification(`Tracking added: ${trackingNumber} (${carrier.toUpperCase()})`, "success");

        // Clear input fields
        trackingInput.value = "";
        carrierSelect.value = "";
    }

    // Render the fake package list
    function renderPackages() {
        packageGrid.innerHTML = "";

        if (fakePackages.length === 0) {
            packageGrid.innerHTML = `<p class="no-packages-message">No tracked packages yet.</p>`;
            return;
        }

        fakePackages.forEach(pkg => {
            const packageCard = document.createElement("div");
            packageCard.classList.add("package-card");
            packageCard.innerHTML = `
                <div class="package-info">
                    <strong>${pkg.id}</strong>
                    <p>Carrier: ${pkg.carrier}</p>
                    <p>Status: <span class="status-label">${pkg.status}</span></p>
                    <p>ETA: ${pkg.eta}</p>
                </div>
            `;
            packageGrid.appendChild(packageCard);
        });
    }

    // Simulated notifications
    function showNotification(message, type) {
        const notificationContainer = document.getElementById("notificationContainer");
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    // Hook up event listeners
    trackButton.addEventListener("click", addFakePackage);

    // Autofill tracking input during tutorial
    setTimeout(autofillTracking, 1500); // Simulates a delayed auto-fill

    // Initial render
    renderPackages();
});
