// ==========================================
// 1. KONFIGURASI HADIAH
// ==========================================
const daftarHadiah = [
    { 
        name: "Coklat Manis 🍫", 
        img: "img/coklat.png" // Pastikan ada file ini di folder img
    },      
    { 
        name: "Ice Cream Segar 🍦", 
        img: "img/icecream.png" // Pastikan ada file ini di folder img
    },
    { 
        name: "Peluk & Cium 🤗", 
        // Menggunakan Link Online (Giphy)
        img: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXBwaHZ3cjhzcWo0YXpmaGZvbnpwaWdiaG9ncDNwYTJ1Mjg3cGl4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qFmdpUKAFZ6rMobzzu/giphy.gif" 
    }   
];

const PASSWORD_BENAR = "00000"; // Ganti Password sesuai keinginan

// ==========================================
// 2. VARIABEL GLOBAL
// ==========================================
let hadiahAcak = [];
let kadoTerbuka = 0;
let boxIdYangSedangDibuka = 0; 
const totalKado = 3;

// ==========================================
// 3. INISIALISASI (SAAT WEBSITE DIMUAT)
// ==========================================
window.onload = function() {
    // Acak urutan hadiah saat pertama kali dibuka
    hadiahAcak = shuffleArray(daftarHadiah); 
};

// Fungsi Pengacak Array (Fisher-Yates Shuffle)
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
// 4. NAVIGASI HALAMAN & TOMBOL
// ==========================================

// Pindah dari Halaman 1 ke Halaman 2
function goToGifts() {
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
}

// Logika Tombol "Gak Dulu" (Kabur)
const btnNo = document.getElementById('btnNo');

// Event untuk PC (Mouse) dan HP (Touch)
btnNo.addEventListener('mouseover', kabur);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Mencegah tombol terpencet di HP
    kabur();
});

// Ganti Fungsi Kabur dengan yang ini:
function kabur() {
    // Ambil ukuran layar
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Ambil ukuran tombol
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    // Hitung batas aman (Layar - Tombol - Margin Besar biar gak mepet)
    const maxX = windowWidth - btnWidth - 50; 
    const maxY = windowHeight - btnHeight - 50;

    // Acak posisi (Minimal 20px dari pinggir)
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);

    // Terapkan posisi
    btnNo.style.position = 'fixed'; // Ubah jadi fixed
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
}

// ==========================================
// 5. LOGIKA BUKA KADO
// ==========================================

function pilihKado(nomorBox) {
    const box = document.getElementById('box' + nomorBox);
    
    // Cek apakah kado sudah diambil (ada class 'claimed')
    // Jika sudah, hentikan fungsi (return)
    if (box.classList.contains('claimed')) return;

    boxIdYangSedangDibuka = nomorBox;

    // --- LOGIKA GEMBOK OTOMATIS ---
    // Jika user sudah membuka 2 kado, maka kado ke-3 PASTI digembok
    if (kadoTerbuka === 2) {
        // Tampilkan Modal Password
        document.getElementById('passModal').classList.remove('hidden');
    } else {
        // Jika bukan kado terakhir, langsung buka isinya
        tampilkanIsiHadiah(kadoTerbuka);
    }
}

// ==========================================
// 6. PASSWORD & HADIAH
// ==========================================

function cekPassword() {
    const input = document.getElementById('passInput').value;
    
    if (input === PASSWORD_BENAR) {
        document.getElementById('passModal').classList.add('hidden');
        // Buka hadiah urutan terakhir (index 2)
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

    // Ambil data hadiah dari array yang sudah diacak
    const data = hadiahAcak[indexHadiah];

    // Set gambar dan teks
    imgElement.src = data.img;
    textElement.innerText = data.name;

    // Munculkan Modal
    modal.classList.remove('hidden');
}

// ==========================================
// 7. SELESAI & KLAIM
// ==========================================

function tandaiSelesai() {
    // Sembunyikan modal hadiah
    document.getElementById('giftModal').classList.add('hidden');
    
    // Ambil kotak kado yang tadi diklik
    const box = document.getElementById('box' + boxIdYangSedangDibuka);
    
    // Tambahkan class 'claimed' 
    // (Ini akan memicu CSS untuk membuat transparan & muncul centang)
    box.classList.add('claimed');
    
    // Kosongkan isi HTML box agar gambar kado hilang
    // (Nanti digantikan oleh Centang dari CSS ::after)
    box.innerHTML = ""; 

    kadoTerbuka++;

    // Cek apakah semua kado (3) sudah terbuka
    if (kadoTerbuka === totalKado) {
        setTimeout(() => {
            // Pindah ke Halaman Ending (Page 3)
            document.getElementById('page2').classList.add('hidden');
            document.getElementById('page3').classList.remove('hidden');
        }, 1000); // Jeda 1 detik
    }
}

function tutupModal() {
    tandaiSelesai();
}