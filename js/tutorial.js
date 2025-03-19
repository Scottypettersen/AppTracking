document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("tutorialCompleted")) return; // Skip tutorial if already completed

    const steps = [
        { selector: "body", message: "Welcome to PackageTracker! Let’s walk through how it works.", button: "Get Started" },
        { selector: "#trackingInput", message: "Enter a tracking number here. Let’s auto-fill one for you.", autoFill: "1Z999AA10123456784", button: "Next" },
        { selector: "#carrierSelect", message: "Choose your shipping carrier. We've auto-selected UPS for this demo.", autoSelect: "ups", button: "Next" },
        { selector: ".track-button", message: "Click here to track the package!", clickSimulated: true, button: "Track Package" },
        { selector: "#packageGrid", message: "Here’s where your tracked packages appear. Try sorting or filtering.", button: "Next" },
        { selector: "#themeToggle", message: "Click to enable dark mode!", clickSimulated: true, button: "Try Dark Mode" },
        { selector: "body", message: "You're all set! Start tracking your packages now.", final: true, button: "Finish" }
    ];

    let currentStep = 0;

    function showTooltip(step) {
        const target = document.querySelector(step.selector);
        if (!target) {
            console.warn(`Tutorial Step Skipped: Element ${step.selector} not found.`);
            nextStep();
            return;
        }

        document.querySelectorAll(".tutorial-tooltip").forEach(el => el.remove());

        const tooltip = document.createElement("div");
        tooltip.className = "tutorial-tooltip";
        tooltip.innerHTML = `<p>${step.message}</p><button class="tutorial-button">${step.button}</button>`;
        document.body.appendChild(tooltip);

        const rect = target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;

        target.style.boxShadow = "0 0 15px rgba(37, 99, 235, 0.7)";
        target.style.transition = "box-shadow 0.3s ease";
        target.scrollIntoView({ behavior: "smooth", block: "center" });

        if (step.autoFill) document.querySelector("#trackingInput").value = step.autoFill;
        if (step.autoSelect) document.querySelector("#carrierSelect").value = step.autoSelect;
        if (step.clickSimulated) target.click();

        document.querySelector(".tutorial-button").addEventListener("click", nextStep);
    }

    function nextStep() {
        document.querySelectorAll(".tutorial-tooltip").forEach(el => el.remove());
        document.querySelectorAll("*").forEach(el => el.style.boxShadow = "none");

        if (currentStep < steps.length - 1) {
            currentStep++;
            setTimeout(() => showTooltip(steps[currentStep]), 500);
        } else {
            endTutorial();
        }
    }

    function endTutorial() {
        localStorage.setItem("tutorialCompleted", "true");

        const endMessage = document.createElement("div");
        endMessage.className = "tutorial-tooltip";
        endMessage.innerHTML = "<p>You're all set! Start tracking your packages now.</p>";
        document.body.appendChild(endMessage);
        endMessage.style.left = "50%";
        endMessage.style.top = "20px";
        endMessage.style.transform = "translateX(-50%)";

        setTimeout(() => endMessage.remove(), 3000);
    }

    showTooltip(steps[currentStep]);
});
