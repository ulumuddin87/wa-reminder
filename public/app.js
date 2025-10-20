// ✅ app.js — versi sinkron final dengan Netlify Functions

// Cek login
if (localStorage.getItem("logged_in") !== "yes") {
  window.location.href = "/login.html";
}

// ✅ Muat data dari Supabase via Netlify Function
async function loadInvoices() {
  const tableBody = document.querySelector("#invoiceTableBody");
  tableBody.innerHTML = `<tr><td colspan="6" class="text-center">⏳ Memuat data...</td></tr>`;

  try {
    const res = await fetch("/.netlify/functions/get_invoices"); // ✅ disesuaikan
    const result = await res.json();

    if (!result.success || !Array.isArray(result.rows) || result.rows.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Tidak ada data</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    result.rows.forEach((inv) => {
      const tr = document.createElement("tr");
      const statusClass =
        inv.status === "sent"
          ? "table-success"
          : inv.status === "pending"
          ? "table-warning"
          : "table-secondary";

      tr.classList.add(statusClass);
      tr.innerHTML = `
        <td>${inv.name}</td>
        <td>${inv.phone}</td>
        <td>${inv.due_date}</td>
        <td>${Number(inv.amount).toLocaleString("id-ID")}</td>
        <td>${inv.status}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="sendNow('${inv.id}')">📤 Kirim WA</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Gagal memuat data:", err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data</td></tr>`;
  }
}

// ✅ Kirim pesan WhatsApp manual
async function sendNow(id) {
  if (!confirm("Kirim pesan WhatsApp ke nasabah ini?")) return;
  try {
    const res = await fetch(`/.netlify/functions/send_now?id=${id}`, { method: "POST" }); // disesuaikan
    const result = await res.json();
    alert(result.message || "Pesan terkirim!");
    loadInvoices();
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim pesan");
  }
}

// ✅ Tambah nasabah
async function addInvoice(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const due_date = document.getElementById("due_date").value;
  const amount = document.getElementById("amount").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !phone || !due_date || !amount) {
    alert("Semua field wajib diisi!");
    return;
  }

  const payload = { name, phone, due_date, amount, message };

  try {
    const res = await fetch("/.netlify/functions/add_nasabah", { // ✅ disesuaikan
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal menambah data");

    alert("✅ Nasabah berhasil ditambahkan");
    document.getElementById("addInvoiceForm").reset();
    loadInvoices();
  } catch (err) {
    console.error("Gagal menambah data:", err);
    alert("❌ Gagal menambah data nasabah");
  }
}

// Logout
function logout() {
  localStorage.removeItem("logged_in");
  window.location.href = "/login.html";
}

// Jalankan otomatis saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadInvoices);
