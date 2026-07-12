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
     try {
    // Generate tracking number
    const trackingNumber = "PT" + Date.now().toString().slice(-8);

    // Save to Firestore
    await addDoc(collection(db, "parcels"), {
        trackingNumber,
        sender,
        receiver,
        location,
        status,
        createdAt: serverTimestamp()
    });

    message.innerHTML = `
        <h3>✅ Parcel Saved Successfully</h3>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
    `;

} catch (error) {
    console.error(error);

    message.innerHTML = `
        <p style="color:red;">
            Error saving parcel.
        </p>
    `;
}

        // Generate a simple tracking number
        const trackingNumber =
            "PT" + Date.now().toString().slice(-8);

        message.innerHTML = `
            <h3>✅ Parcel Created Successfully</h3>
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p>Sender: ${sender}</p>
            <p>Receiver: ${receiver}</p>
            <p>Status: ${status}</p>
            <p>Location: ${location}</p>
        `;

        console.log({
            trackingNumber,
            sender,
            receiver,
            status,
            location
        });
    });
});