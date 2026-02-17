// ==========================================
// 1. KONFIGURASI HADIAH
// ==========================================
const daftarHadiah = [
    { 
        name: "Coklat Manis 🍫", 
        img: "img/coklat.png" // Pastikan file ada di folder img
    },      
    { 
        name: "Ice Cream Segar 🍦", 
        img: "img/eskrim.png" // Pastikan file ada di folder img
    },
    { 
        name: "Free Hug & Kisses 🤗", 
        // Link Online (Giphy)
        img: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXBwaHZ3cjhzcWo0YXpmaGZvbnpwaWdiaG9ncDNwYTJ1Mjg3cGl4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qFmdpUKAFZ6rMobzzu/giphy.gif" 
    }   
];

const PASSWORD_BENAR = "00000"; // Password Gembok

// ==========================================
// 2. VARIABEL GLOBAL
// ==========================================
let hadiahAcak = [];
let kadoTerbuka = 0;
let boxIdYangSedangDibuka = 0; 
const totalKado = 3;

// ==========================================
// 3. INISIALISASI
// ==========================================
window.onload = function() {
    hadiahAcak = shuffleArray(daftarHadiah); 
};

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// ==========================================
// 4. NAVIGASI HALAMAN & TOMBOL KABUR
// ==========================================

function goToGifts() {
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
}

// ==========================================
// LOGIKA TOMBOL KABUR (Update Terbaru)
// ==========================================
const btnNo = document.getElementById('btnNo');

// Fungsi untuk membuat tombol kabur
function kabur(e) {
    // Mencegah tombol diklik beneran (khusus HP)
    if (e) e.preventDefault();

    // 1. Ambil Ukuran Layar & Tombol
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    // 2. Hitung Batas Aman (Agar tidak keluar layar)
    // Layar - Ukuran Tombol - Margin Aman (misal 20px biar gak mepet banget)
    const maxX = windowWidth - btnWidth - 20;
    const maxY = windowHeight - btnHeight - 20;

    // 3. Tentukan Koordinat Acak di dalam Batas Aman
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // 4. Terapkan Posisi Baru
    btnNo.style.position = 'fixed'; // Ubah jadi fixed biar bebas gerak
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
}

// Event Listener untuk PC (Mouse Over / Kursor mendekat)
btnNo.addEventListener('mouseover', kabur);

// Event Listener untuk HP (Touch / Sentuh layar)
btnNo.addEventListener('touchstart', kabur);

// Event Listener Klik (Jaga-jaga kalau ada yang cepet banget ngeklik)
btnNo.addEventListener('click', kabur);

// ==========================================
// 5. LOGIKA BUKA KADO
// ==========================================

function pilihKado(nomorBox) {
    const box = document.getElementById('box' + nomorBox);
    
    if (box.classList.contains('claimed')) return;

    boxIdYangSedangDibuka = nomorBox;

    // LOGIKA GEMBOK OTOMATIS (Kado ke-3 pasti digembok)
    if (kadoTerbuka === 2) {
        document.getElementById('passModal').classList.remove('hidden');
    } else {
        tampilkanIsiHadiah(kadoTerbuka);
    }
}

// ==========================================
// 6. PASSWORD & MODAL HADIAH
// ==========================================

function cekPassword() {
    const input = document.getElementById('passInput').value;
    if (input === PASSWORD_BENAR) {
        document.getElementById('passModal').classList.add('hidden');
        tampilkanIsiHadiah(2); 
    } else {
        alert("Salah wleee! 😜 Coba ingat tanggal jadian!");
    }
}

function tutupPass() {
    document.getElementById('passModal').classList.add('hidden');
}

function tampilkanIsiHadiah(indexHadiah) {
    const modal = document.getElementById('giftModal');
    const imgElement = document.getElementById('giftImage');
    const textElement = document.getElementById('giftText');

    const data = hadiahAcak[indexHadiah];
    imgElement.src = data.img;
    textElement.innerText = data.name;

    modal.classList.remove('hidden');
}

// ==========================================
// 7. FUNGSI DOWNLOAD GAMBAR (NEW FEATURE)
// ==========================================
function downloadBukti(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        })
        .catch(() => {
            // Fallback jika gagal (misal security browser ketat)
            // Buka di tab baru biar manual save
            window.open(url, '_blank');
        });
}

// ==========================================
// 8. TOMBOL SIMPAN / SELESAI
// ==========================================

function tandaiSelesai() {
    // 1. DOWNLOAD DULU SEBAGAI BUKTI
    const imgUrl = document.getElementById('giftImage').src;
    const giftName = document.getElementById('giftText').innerText;
    
    // Nama file saat didownload: "Bukti_Hadiah_Coklat.png"
    const safeName = giftName.replace(/[^a-zA-Z0-9]/g, '_'); 
    downloadBukti(imgUrl, `Bukti_Hadiah_${safeName}.png`);

    // 2. LANJUT PROSES TUTUP MODAL
    document.getElementById('giftModal').classList.add('hidden');
    
    const box = document.getElementById('box' + boxIdYangSedangDibuka);
    box.classList.add('claimed');
    box.innerHTML = ""; 

    kadoTerbuka++;

    if (kadoTerbuka === totalKado) {
        setTimeout(() => {
            document.getElementById('page2').classList.add('hidden');
            document.getElementById('page3').classList.remove('hidden');
        }, 1000);
    }
}

function tutupModal() {
    // Kalau klik tombol X, tutup aja tanpa download
    document.getElementById('giftModal').classList.add('hidden');
    
    // Tetap tandai selesai biar gak error logicnya
    const box = document.getElementById('box' + boxIdYangSedangDibuka);
    if (!box.classList.contains('claimed')) {
         box.classList.add('claimed');
         box.innerHTML = "";
         kadoTerbuka++;
    }

    if (kadoTerbuka === totalKado) {
        setTimeout(() => {
            document.getElementById('page2').classList.add('hidden');
            document.getElementById('page3').classList.remove('hidden');
        }, 1000);
    }
}