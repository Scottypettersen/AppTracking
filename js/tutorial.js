document.addEventListener("DOMContentLoaded", () => {
    const steps = [
        {
            element: ".quick-add-section",
            message: "Welcome to PackageTracker! Let's walk through how it works. Click 'Next' to continue.",
        },
        {
            element: "#trackingInput",
            message: "This is where you'd enter a tracking number. For now, we'll add one for you.",
            action: () => document.querySelector("#trackingInput").value = "1Z999AA10123456784",
        },
        {
            element: "#carrierSelect",
            message: "Select the shipping carrier for your package. Auto-detection helps speed this up!",
            action: () => document.querySelector("#carrierSelect").selectedIndex = 1,
        },
        {
            element: ".track-button",
            message: "Click 'Track Package' to see your shipment details.",
            action: () => document.querySelector(".track-button").classList.add("highlight"),
        },
        {
            element: ".package-grid",
            message: "Here's your package! You can track multiple shipments here.",
            action: () => {
                document.querySelector("#packageGrid").innerHTML = `
                    <div class="package-card">
                        <p><strong>Tracking #:</strong> 1Z999AA10123456784</p>
                        <p><strong>Carrier:</strong> UPS</p>
                        <p class="status-label" data-status="in-transit">Status: In Transit</p>
                        <p><strong>ETA:</strong> March 21, 2025</p>
                    </div>`;
            }
        },
        {
            element: ".search-bar",
            message: "Use the search bar to quickly find your shipments.",
        },
        {
            element: ".filter-select",
            message: "Filters help you organize by delivery status or carrier.",
        },
        {
            element: ".packages-section",
            message: "That's it! You're now ready to use PackageTracker. Click 'Next' to close the tutorial.",
        },
    ];

    let currentStep = 0;
    let tooltip, nextButton, skipButton, overlay;

    function createTutorialElements() {
        overlay = document.createElement("div");
        overlay.classList.add("tutorial-overlay");

        tooltip = document.createElement("div");
        tooltip.classList.add("tutorial-tooltip");

        nextButton = document.createElement("button");
        nextButton.innerText = "Next";
        nextButton.classList.add("tutorial-button");
        nextButton.addEventListener("click", nextStep);

        skipButton = document.createElement("button");
        skipButton.innerText = "Skip Tutorial";
        skipButton.classList.add("tutorial-skip");
        skipButton.addEventListener("click", endTutorial);

        tooltip.appendChild(nextButton);
        tooltip.appendChild(skipButton);

        document.body.appendChild(overlay);
        document.body.appendChild(tooltip);
    }

    function positionTooltip(targetElement) {
        if (!targetElement) return;

        const rect = targetElement.getBoundingClientRect();
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.classList.add("show");
    }

    function showStep(stepIndex) {
        if (stepIndex >= steps.length) {
            endTutorial();
            return;
        }

        const step = steps[stepIndex];
        const targetElement = document.querySelector(step.element);

        if (!targetElement) {
            nextStep();
            return;
        }

        document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
        targetElement.classList.add("highlight");

        tooltip.innerHTML = `<p>${step.message}</p>`;
        tooltip.appendChild(nextButton);
        tooltip.appendChild(skipButton);

        if (step.action) step.action();

        positionTooltip(targetElement);
    }

    function nextStep() {
        currentStep++;
        showStep(currentStep);
    }

    function endTutorial() {
        document.body.removeChild(overlay);
        document.body.removeChild(tooltip);
        document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
        localStorage.setItem("tutorialCompleted", "true");
    }

    createTutorialElements();
    showStep(currentStep);
});
