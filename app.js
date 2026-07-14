import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const button = document.querySelector("button");
    const trackingInput = document.getElementById("trackingCode");
    const result = document.getElementById("result");

    button.addEventListener("click", searchParcel);

    trackingInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchParcel();
        }
    });

    async function searchParcel() {

        const trackingNumber = trackingInput.value.trim();

        if (!trackingNumber) {
            result.innerHTML = "Please enter a tracking number.";
            return;
        }

        result.innerHTML = "Searching...";

        try {

            const q = query(
                collection(db, "parcels"),
                where("trackingNumber", "==", trackingNumber)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                result.innerHTML = "Parcel not found.";
                return;
            }

            snapshot.forEach((doc) => {

                const parcel = doc.data();

              const steps = [
    "Shipment Created",
    "Picked Up",
    "In Transit",
    "Custom Check",
    "Out for Delivery",
    "Delivered"
];

const currentStep = steps.findIndex(
    step => step.toLowerCase() === parcel.status.toLowerCase()
);

let progressHTML = '<div class="progress-bar">';

steps.forEach((step, index) => {

    let circle = index < currentStep ? "✓" : index + 1;

    progressHTML += `
        <div class="step ${index <= currentStep ? "active" : ""}">
            <div class="circle">${circle}</div>
            <div class="step-title">${step}</div>
        </div>
    `;

});

progressHTML += "</div>";
                let timeline = "";

              

                if (parcel.history && parcel.history.length > 0) {

                    const history = [...parcel.history].reverse();
                  

                    history.forEach((item) => {
                        
                           let date = "Unknown time";

if (item.time) {
    if (item.time.toDate) {
        date = item.time.toDate().toLocaleString();
    } else {
        date = new Date(item.time).toLocaleString();
    }
}
                      
                      timeline += `
<div class="timeline-item">

    <div class="timeline-dot"></div>

    <div class="timeline-content">

        <h4>${item.status}</h4>

        <p>${item.location}</p>

        <small>${date}</small>

    </div>

</div>
`;
                      

                    });

                } else {

                    timeline = "<p>No tracking history available.</p>";

                }

                result.innerHTML = `

<div class="shipment-card">

<h2>📦 Shipment Information</h2>

<div class="info-grid">

<div class="info-box">
<h4>Tracking Number</h4>
<p>${parcel.trackingNumber}</p>
</div>

<div class="info-box">
<h4>Current Status</h4>
<p><span class="status">${parcel.status}</span></p>
</div>

<div class="info-box">
<h4>Current Location</h4>
<p>${parcel.location}</p>
</div>

<div class="info-box">
<h4>Estimated Delivery</h4>
<p>${parcel.deliveryDate || "Pending"}</p>
</div>

</div>

<h2>👤 Sender Information</h2>

<div class="info-grid">

<div class="info-box">
<h4>Sender</h4>
<p>${parcel.sender}</p>
</div>

<div class="info-box">
<h4>Sender Address</h4>
<p>${parcel.senderAddress || "Not Available"}</p>
</div>

</div>

<h2>📍 Receiver Information</h2>

<div class="info-grid">

<div class="info-box">
<h4>Receiver</h4>
<p>${parcel.receiver}</p>
</div>

<div class="info-box">
<h4>Receiver Address</h4>
<p>${parcel.receiverAddress || "Not Available"}</p>
</div>

</div>

<h2>🚚 Shipping Details</h2>

<div class="info-grid">

<div class="info-box">
<h4>Origin</h4>
<p>${parcel.origin || "Not Available"}</p>
</div>

<div class="info-box">
<h4>Destination</h4>
<p>${parcel.destination || "Not Available"}</p>
</div>

<div class="info-box">
<h4>Parcel Type</h4>
<p>${parcel.parcelType || "Not Available"}</p>
</div>

<div class="info-box">
<h4>Weight</h4>
<p>${parcel.weight || "Not Available"} kg</p>
</div>

</div>

${progressHTML}

<h2>Tracking History</h2>

<div class="timeline">
${timeline}
</div>

</div>

`;

            });

        } catch (error) {

            console.error(error);
            result.innerHTML = "Error loading parcel.";

        }

    }

});
