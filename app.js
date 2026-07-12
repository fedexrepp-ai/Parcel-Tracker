document.addEventListener("DOMContentLoaded", () => {
    const trackButton = document.querySelector("button");
    const trackingInput = document.getElementById("trackingCode");
    const result = document.getElementById("result");

    trackButton.addEventListener("click", () => {
        const trackingCode = trackingInput.value.trim();

        if (trackingCode === "") {
            result.innerHTML = `
                <p style="color:red;">
                    Please enter a tracking number.
                </p>
            `;
            return;
        }

        result.innerHTML = `
            <h3>Tracking Result</h3>
            <p><strong>Tracking Number:</strong> ${trackingCode}</p>
            <p>Status: 🔍 Searching Firebase...</p>
        `;
    });
});