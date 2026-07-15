import { db, auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    arrayUnion,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Protect admin page
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {

    // Buttons
    const createButton = document.getElementById("createParcel");
    const updateButton = document.getElementById("updateParcel");
    const loadButton = document.getElementById("loadShipment");
    const logoutBtn = document.getElementById("logoutBtn");

    // Message area
    const message = document.getElementById("message");

    // Currently loaded Firestore document
    let loadedParcelId = null;

    // Logout
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });

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

    const description = document.getElementById("description").value.trim();

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

            history: [{
                status: status,
                location: location,
                description: description,
                time: new Date().toISOString()
            }],

            createdAt: serverTimestamp()

        });

        message.innerHTML =
        `<h3>✅ Parcel Created Successfully</h3>
        <p><b>Tracking Number:</b> ${trackingNumber}</p>`;

    } catch (error) {

        console.error(error);
        message.innerHTML = "Error creating parcel: " + error.message;

    }

});
    

    loadButton.addEventListener("click", async () => {

    const tracking = document.getElementById("searchTracking").value.trim();

    if (!tracking) {
        alert("Please enter a tracking number.");
        return;
    }

    try {

        const q = query(
            collection(db, "parcels"),
            where("trackingNumber", "==", tracking)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert("Shipment not found.");
            return;
        }

        const docSnap = snapshot.docs[0];

        loadedParcelId = docSnap.id;

        const parcel = docSnap.data();

        document.getElementById("sender").value = parcel.sender || "";
        document.getElementById("senderAddress").value = parcel.senderAddress || "";

        document.getElementById("receiver").value = parcel.receiver || "";
        document.getElementById("receiverAddress").value = parcel.receiverAddress || "";

        document.getElementById("parcelType").value = parcel.parcelType || "";
        document.getElementById("weight").value = parcel.weight || "";

        document.getElementById("origin").value = parcel.origin || "";
        document.getElementById("destination").value = parcel.destination || "";

        document.getElementById("location").value = parcel.location || "";
        document.getElementById("deliveryDate").value = parcel.deliveryDate || "";

        document.getElementById("status").value = parcel.status || "";

        alert("Shipment loaded successfully.");

    } catch (error) {

        console.error(error);
        alert("Error loading shipment.");

    }

});

    updateButton.addEventListener("click", async () => {

    if (!loadedParcelId) {
        alert("Please load a shipment first.");
        return;
    }

    let status = document.getElementById("status").value;
    const customStatus = document.getElementById("customStatus").value.trim();

    if (status === "Other" && customStatus) {
        status = customStatus;
    }

    try {

        await updateDoc(doc(db, "parcels", loadedParcelId), {

            sender: document.getElementById("sender").value.trim(),
            senderAddress: document.getElementById("senderAddress").value.trim(),

            receiver: document.getElementById("receiver").value.trim(),
            receiverAddress: document.getElementById("receiverAddress").value.trim(),

            parcelType: document.getElementById("parcelType").value.trim(),
            weight: document.getElementById("weight").value.trim(),

            origin: document.getElementById("origin").value.trim(),
            destination: document.getElementById("destination").value.trim(),

            location: document.getElementById("location").value.trim(),
            deliveryDate: document.getElementById("deliveryDate").value,

            status: status,

            history: arrayUnion({
                status: status,
                location: document.getElementById("location").value.trim(),
                description: document.getElementById("description").value.trim(),
                time: new Date().toISOString()
            })

        });

        message.innerHTML =
        "<h3>✅ Shipment updated successfully.</h3>";

    } catch (error) {

        console.error(error);
        message.innerHTML =
        "Update failed: " + error.message;

    }

});

    

});
