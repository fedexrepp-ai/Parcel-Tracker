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
                        
                            let date = "unknown time";
                      if (item.time) {
                        if (item.time.toDate) {
                          date = 
                          item.time.toDate().toLocalestring();
                      } else {
                        date = new
                          Date(item.time).toLocaleString();
                      }
                    }
                        timeline += `
                            <div class="timeline-item">
                                <h4>${item.status}</h4>
                                <p>${item.location}</p>
                                <small>${date}</small>
                            </div>
                        `;

                    });

                } else {

                    timeline = "<p>No tracking history available.</p>";

                }

                result.innerHTML = `
                    <h3>Parcel Details</h3>
                    ${progressHTML}
                    <p><b>Tracking Number:</b> ${parcel.trackingNumber}</p>
   <p><b>Parcel Type:</b> ${parcel.parcelType || "Not available"}</p>
             <p><b>Weight:</b> ${parcel.parcelweight || "Not available"} kg</p>
                    <p><b>Sender:</b> ${parcel.sender}</p>
                       <p><b>Sender AAddress:</b> ${parcel.senderAddress || "Not available"}</p>
                    <p><b>Receiver:</b> ${parcel.receiver}</p>
                       <p><b>Receiver Address:</b> ${parcel.receiverAddress || "Not available"}</p>
<p><b>Origin:</b> ${parcel.origin || "Not available"}</p>
<p><b>Destination:</b> ${parcel.destination || "Not available"}</p>
                                           <p><b>Current Location:</b> ${parcel.location}</p>                                      
                    <p><b>Estimated Delivery:</> ${parcel.deliveryDate || "Not available"}</p>
  
                    <p><b>Status:</b> ${parcel.status}</p>
                    
                    <h3>Tracking History</h3>
  
                    <div class="timeline">
                        ${timeline}
                    </div>
                `;

            });

        } catch (error) {

            console.error(error);
            result.innerHTML = "Error loading parcel.";

        }

    }

});
