document.addEventListener("DOMContentLoaded", function () {
    const trackingInput = document.getElementById("trackingInput");
    const carrierSelect = document.getElementById("carrierSelect");
    const packageNameInput = document.getElementById("packageNameInput"); // Name input
    const trackButton = document.querySelector(".track-button");
    const packageGrid = document.getElementById("packageGrid");
    const tutorialToggle = document.getElementById("tutorialToggle"); // New toggle button

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });

    // Preserve dark mode state
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }

    // Simulated package data
    let trackedPackages = JSON.parse(localStorage.getItem("trackedPackages")) || [
        { id: "1Z999AA10123456784", carrier: "UPS", status: "In Transit", eta: "March 21, 2025", name: "Gaming Keyboard" },
        { id: "9400110200881234567890", carrier: "USPS", status: "Out for Delivery", eta: "Today", name: "New Phone Case" }
    ];

    function autofillTracking() {
        trackingInput.value = trackedPackages[0].id;
        carrierSelect.value = trackedPackages[0].carrier.toLowerCase();
        packageNameInput.value = trackedPackages[0].name;
    }

    function addPackage() {
        const trackingNumber = trackingInput.value.trim();
        const carrier = carrierSelect.value.trim();
        const packageName = packageNameInput.value.trim() || "Unnamed Package";

        if (!trackingNumber || !carrier) {
            showNotification("Please enter a tracking number and select a carrier.", "error");
            return;
        }

        const newPackage = {
            id: trackingNumber,
            carrier: carrier.toUpperCase(),
            status: "Tracking Created",
            eta: "Estimated in 2-3 days",
            name: packageName
        };

        trackedPackages.push(newPackage);
        localStorage.setItem("trackedPackages", JSON.stringify(trackedPackages));
        renderPackages();
        showNotification(`Tracking added: ${packageName}`, "success");

        trackingInput.value = "";
        carrierSelect.value = "";
        packageNameInput.value = "";
    }

    function renderPackages() {
        packageGrid.innerHTML = "";

        if (trackedPackages.length === 0) {
            packageGrid.innerHTML = `<p class="no-packages-message">No tracked packages yet.</p>`;
            return;
        }

        trackedPackages.forEach(pkg => {
            const packageCard = document.createElement("div");
            packageCard.classList.add("package-card");
            packageCard.innerHTML = `
                <div class="package-info">
                    <strong>${pkg.name}</strong>
                    <p><strong>Tracking #:</strong> ${pkg.id}</p>
                    <p><strong>Carrier:</strong> ${pkg.carrier}</p>
                    <p class="status-label" data-status="${pkg.status.toLowerCase()}"><strong>Status:</strong> ${pkg.status}</p>
                    <p><strong>ETA:</strong> ${pkg.eta}</p>
                </div>
            `;
            packageGrid.appendChild(packageCard);
        });
    }

    function showNotification(message, type) {
        const notificationContainer = document.getElementById("notificationContainer");
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    // Attach event listener
    trackButton.addEventListener("click", addPackage);
    tutorialToggle.addEventListener("click", toggleTutorial); // Tutorial Toggle

    // Initial render
    renderPackages();
});

/* ------------------------------ */
/* 🔹 2. CSS – Fix Layout & Tutorial */
/* ------------------------------ */
