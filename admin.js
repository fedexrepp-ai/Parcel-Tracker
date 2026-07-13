import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    const createButton = document.getElementById("createParcel");
    const message = document.getElementById("message");

    createButton.addEventListener("click", async () => {

        const sender = document.getElementById("sender").value.trim();
        const receiver = document.getElementById("receiver").value.trim();
        const location = document.getElementById("location").value.trim();
        const status = document.getElementById("status").value;

        if (!sender || !receiver || !location) {
            message.innerHTML = "Please fill in all fields.";
            return;
        }

        const trackingNumber = "PT" + Date.now().toString().slice(-8);

        try {

            await addDoc(collection(db, "parcels"), {
                trackingNumber,
                sender,
                receiver,
                location,
                status,
                createdAt: serverTimestamp()
            });

            message.innerHTML = `
                <h3>✅ Parcel Created</h3>
                <p><b>Tracking Number:</b> ${trackingNumber}</p>
                <p>Sender: ${sender}</p>
                <p>Receiver: ${receiver}</p>
                <p>Status: ${status}</p>
                <p>Location: ${location}</p>
            `;

        } catch (error) {

            console.error(error);

            message.innerHTML = `
                <p>Error saving parcel: ${error.message}</p>
            `;
        }

    });

});