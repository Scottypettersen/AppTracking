document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    const packageGrid = document.getElementById("packageGrid");
    const trackingForm = document.getElementById("trackingForm");
    const trackingInput = document.getElementById("trackingInput");
    const packageNameInput = document.getElementById("packageNameInput");
    const statusFilter = document.getElementById("statusFilter");
    const sortPackages = document.getElementById("sortPackages");
    const notificationContainer = document.getElementById("notificationContainer");
    const firstTimePopup = document.getElementById("firstTimePopup");
    const popupCloseBtn = document.querySelector(".popup-close");

    // Dark Mode Toggle - Persist Across Sessions
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        if (body.classList.contains("dark")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.removeItem("darkMode");
        }
        themeToggle.setAttribute("aria-pressed", body.classList.contains("dark"));
        themeToggle.classList.add("rotate");
        setTimeout(() => themeToggle.classList.remove("rotate"), 300);
    });

    // Fix First-Time User Popup Display & LocalStorage
    if (!localStorage.getItem("popupDismissed")) {
        firstTimePopup.classList.add("show");
    }

    popupCloseBtn.addEventListener("click", () => {
        firstTimePopup.classList.remove("show");
        localStorage.setItem("popupDismissed", "true");
    });

    // Ensure popup hides properly
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener("click", () => {
            firstTimePopup.style.display = "none";
        });
    }

    // Fix Track Package Button Not Working
    trackingForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload
        if (firstTimePopup.classList.contains("show")) {
            firstTimePopup.classList.remove("show");
            localStorage.setItem("popupDismissed", "true");
        }
        
        const trackingNumber = trackingInput.value.trim();
        const packageName = packageNameInput.value.trim();
        if (trackingNumber === "") {
            showNotification("Please enter a tracking number.", "error");
            return;
        }
        addPackage(trackingNumber, packageName);
        trackingInput.value = "";
        packageNameInput.value = "";
        showNotification("Package added successfully!", "success");
    });

    function addPackage(trackingNumber, packageName) {
        const packageCard = document.createElement("div");
        packageCard.className = "package-card";
        packageCard.setAttribute("data-status", "in-transit");
        packageCard.innerHTML = `<strong>${packageName || "Unnamed Package"}</strong><p>${trackingNumber}</p>`;
        packageGrid.appendChild(packageCard);
    }

    // Sorting logic
    sortPackages.addEventListener("change", () => {
        sortPackageList(sortPackages.value);
    });

    function sortPackageList(criteria) {
        let packages = Array.from(packageGrid.children);
        packages.sort((a, b) => {
            if (criteria === "date") {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            } else if (criteria === "eta") {
                return new Date(a.dataset.eta) - new Date(b.dataset.eta);
            } else if (criteria === "carrier") {
                return a.dataset.carrier.localeCompare(b.dataset.carrier);
            }
        });
        packages.forEach(pkg => packageGrid.appendChild(pkg));
    }

    // Notification System
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});
