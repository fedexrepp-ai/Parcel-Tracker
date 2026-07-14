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
        const senderAddress = document.getElementById("senderAddress").value.trim();

        const receiver = document.getElementById("receiver").value.trim();
        const receiverAddress = document.getElementById("receiverAddress").value.trim();

        const parcelType = document.getElementById("parcelType").value.trim();
        const weight = document.getElementById("weight").value.trim();

        const origin = document.getElementById("origin").value.trim();
        const destination = document.getElementById("destination").value.trim();

        const location = document.getElementById("location").value.trim();

      const description =
document.getElementById("description").value.trim();

      
        const deliveryDate = document.getElementById("deliveryDate").value;

        let status = document.getElementById("status").value;
      const customStatus = document.getElementById("customStatus").value.trim();

      if (status === "Other" && customStatus) {
        status = customStatus;
      }


        if (!sender || !receiver || !location) {
            message.innerHTML = "Please fill in all required fields.";
            return;
        }


        const trackingNumber = "PT" + Date.now().toString().slice(-8);


        try {

            await addDoc(collection(db, "parcels"), {

                trackingNumber,

                sender,
                senderAddress,

                receiver,
                receiverAddress,

                parcelType,
                weight,

                origin,
                destination,

                location,

                deliveryDate,

                status,

                history: [
    {
        status: status,
        location: location,
        description: description,
        time: new Date().toISOString()
    }
],

              
                createdAt: serverTimestamp()

            });


            message.innerHTML = `
                <h3>Parcel Created</h3>
                <p><b>Tracking Number:</b> ${trackingNumber}</p>
                <p>Sender: ${sender}</p>
                <p>Receiver: ${receiver}</p>
                <p>Status: ${status}</p>
                <p>Location: ${location}</p>
            `;


        } catch (error) {

            console.error(error);

            message.innerHTML =
            "Error saving parcel: " + error.message;

        }

    });

});
