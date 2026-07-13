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


    button.addEventListener("click", async () => {

        const trackingNumber = trackingInput.value.trim();

        if (!trackingNumber) {
            result.innerHTML = "Please enter tracking number.";
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
                result.innerHTML = "❌ Parcel not found.";
                return;
            }


            snapshot.forEach((doc) => {

                const parcel = doc.data();

                let timeline = "";


                if (parcel.history && parcel.history.length > 0) {

    const history = [...parcel.history].reverse();

    history.forEach((item) => {

        const date = item.time
            ? new Date(item.time).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
              })
            : "Unknown time";

        timeline += `
        <div class="timeline-item">
            <h4>🚚 ${item.status}</h4>
            <p>📍 ${item.location}</p>
            <small>🕒 ${date}</small>
        </div>
        `;
    });

} else {

    timeline = "<p>No tracking history available.</p>";
}                
result.innerHTML = `

                <h3>📦 Parcel Details</h3>

                <p><b>Tracking Number:</b> ${parcel.trackingNumber}</p>

                <p><b>Sender:</b> ${parcel.sender}</p>

                <p><b>Receiver:</b> ${parcel.receiver}</p>

            <p><b>Status:</b> <span class="status">${parcel.status}</span></p>

                <p><b>Location:</b> ${parcel.location}</p>


                <h3>📍 Tracking History</h3>

<div class="timeline">
    ${timeline}
</div>
                `;

            });


        } catch (error) {

            console.error(error);

            result.innerHTML = "Error loading parcel.";

        }

    });

});