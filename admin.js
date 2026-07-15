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
    getCountFromServer,
    addDoc,
    updateDoc,
    doc,
    arrayUnion,
    serverTimestamp,
    orderBy,
    limit
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
       async function loadDashboardStats() {
           try{

    // Total Shipments
    const totalSnap = await getCountFromServer(
        collection(db, "parcels")
    );

    document.getElementById("totalShipments").textContent =
        totalSnap.data().count;

    // In Transit
    const transitSnap = await getCountFromServer(
        query(
            collection(db, "parcels"),
            where("status", "==", "In Transit")
        )
    );

    document.getElementById("inTransit").textContent =
        transitSnap.data().count;

    // Delivered
    const deliveredSnap = await getCountFromServer(
        query(
            collection(db, "parcels"),
            where("status", "==", "Delivered")
        )
    );

    document.getElementById("delivered").textContent =
        deliveredSnap.data().count;

    // Delayed
    const delayedSnap = await getCountFromServer(
        query(
            collection(db, "parcels"),
            where("status", "==", "Delayed")
        )
    );

    document.getElementById("delayed").textContent =
        delayedSnap.data().count;

}
     } catch (error) {
        console.error("Error loading dashboard statistics:", error);
    }      

loadDashboardStats();
loadRecentShipments();  


    
async function loadRecentShipments() {

    const shipmentList = document.getElementById("shipmentList");
    {
    try {

        const q = query(
            collection(db, "parcels"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            shipmentList.innerHTML = "<p>No shipments found.</p>";
            return;
        }

        let html = `
        <table class="shipment-table">
            <tr>
                <th>Tracking</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
            </tr>
        `;

        snapshot.forEach((doc) => {

            const parcel = doc.data();

            html += `
            <tr>
                <td>${parcel.trackingNumber}</td>
                <td>${parcel.sender}</td>
                <td>${parcel.receiver}</td>
                <td>${parcel.status}</td>
            </tr>
            `;

        });

        html += "</table>";

        shipmentList.innerHTML = html;
    }
    } catch (error) {

        console.error(error);
        shipmentList.innerHTML = "Unable to load shipments.";

    }

}

    
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
loadDashboardStats();
loadRecentShipments();
        
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

// Load the latest tracking description
if (parcel.history && parcel.history.length > 0) {
    const latest = parcel.history[parcel.history.length - 1];
    document.getElementById("description").value = latest.description || "";
} else {
    document.getElementById("description").value = "";
}

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
      loadDashboardStats();  
       loadRecentShipments(); 

    } catch (error) {

        console.error(error);
        message.innerHTML =
        "Update failed: " + error.message;

    }

});

    

});
