import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("updateParcel");
    const message = document.getElementById("message");


    button.addEventListener("click", async () => {

        const trackingNumber = document
            .getElementById("trackingNumber")
            .value.trim();

        const location = document
            .getElementById("location")
            .value.trim();

        const status = document
            .getElementById("status")
            .value;


        if (!trackingNumber || !location) {
            message.innerHTML = "Please fill all fields.";
            return;
        }


        try {

            const q = query(
                collection(db, "parcels"),
                where("trackingNumber", "==", trackingNumber)
            );


            const snapshot = await getDocs(q);


            if (snapshot.empty) {
                message.innerHTML = "❌ Parcel not found.";
                return;
            }


            const parcelDoc = snapshot.docs[0];


            await updateDoc(doc(db, "parcels", parcelDoc.id), {

                status: status,
                location: location,

                history: arrayUnion({
                    status: status,
                    location: location,
                    time: serverTimestamp()
                  
                })

            });


            message.innerHTML = `
                Tracking updated successfully
                <br>
                ${trackingNumber}
            `;


        } catch (error) {

            console.error(error);

            message.innerHTML =
            "Error updating parcel.";

        }

    });

});
