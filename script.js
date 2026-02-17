// ==========================================
// 1. KONFIGURASI HADIAH
// ==========================================
const daftarHadiah = [
    { 
        name: "Coklat Manis 🍫", 
        img: "img/coklat.png" 
    },      
    { 
        name: "Ice Cream Segar 🍦", 
        img: "img/eskrim.png" 
    },
    { 
        name: "Peluk & Cium 🤗", 
        // Link Giphy Asli Punya Mas (Aman, bisa didownload)
        img: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXBwaHZ3cjhzcWo0YXpmaGZvbnpwaWdiaG9ncDNwYTJ1Mjg3cGl4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qFmdpUKAFZ6rMobzzu/giphy.gif" 
    }   
];

const PASSWORD_BENAR = "00000"; // Sesuaikan password/tanggal jadian

// ==========================================
// 2. VARIABEL GLOBAL & INISIALISASI
// ==========================================
let hadiahAcak = [];
let kadoTerbuka = 0;
let boxIdYangSedangDibuka = 0; 
const totalKado = 3;

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
// 3. LOGIKA TOMBOL KABUR (Smooth & Responsive)
// ==========================================
const btnNo = document.getElementById('btnNo');

function kabur(e) {
    if (e) e.preventDefault(); // Mencegah klik di HP

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    // Batas aman (Layar - Tombol - Margin)
    const maxX = windowWidth - btnWidth - 20; 
    const maxY = windowHeight - btnHeight - 20;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    btnNo.style.position = 'fixed'; 
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
}

// Event Listener lengkap (Mouse & Touch)
btnNo.addEventListener('mouseover', kabur);
btnNo.addEventListener('touchstart', kabur);
btnNo.addEventListener('click', kabur);

function goToGifts() {
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
}

// ==========================================
// 4. LOGIKA BUKA KADO & PASSWORD
// ==========================================
function pilihKado(nomorBox) {
    const box = document.getElementById('box' + nomorBox);
    if (box.classList.contains('claimed')) return;

    boxIdYangSedangDibuka = nomorBox;

    // Kado ke-3 (index 2) selalu minta password
    if (kadoTerbuka === 2) {
        document.getElementById('passModal').classList.remove('hidden');
    } else {
        tampilkanIsiHadiah(kadoTerbuka);
    }
}

function cekPassword() {
    const input = document.getElementById('passInput').value;
    if (input === PASSWORD_BENAR) {
        document.getElementById('passModal').classList.add('hidden');
        tampilkanIsiHadiah(2); 
    } else {
        alert("Salah wleee! 😜 Coba ingat lagi!");
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
    
    // Set gambar & teks
    imgElement.src = data.img;
    textElement.innerText = data.name;

    // Tampilkan Modal
    modal.classList.remove('hidden');
}

// ==========================================
// 5. FITUR DOWNLOAD KHUSUS GIPHY / GAMBAR
// ==========================================
async function downloadGambar(url, fileName) {
    try {
        // Fetch gambar dengan mode CORS
        const response = await fetch(url, {
            mode: 'cors',
            cache: 'no-cache'
        });
        
        // Ubah jadi Blob (Data Mentah)
        const blob = await response.blob();
        
        // Buat URL Objek
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Buat Link Palsu & Klik Otomatis
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Bersihkan
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        
    } catch (error) {
        console.error("Gagal download otomatis:", error);
        // Fallback: Kalau gagal, buka tab baru biar save manual
        alert("Download otomatis dicegah browser. Silakan simpan gambar manual ya! ❤️");
        window.open(url, '_blank');
    }
}

// ==========================================
// 6. TOMBOL SIMPAN / SELESAI
// ==========================================
function tandaiSelesai() {
    const imgUrl = document.getElementById('giftImage').src;
    const giftName = document.getElementById('giftText').innerText;
    
    // Tentukan ekstensi file (Kalau link giphy berarti .gif, kalau coklat .png)
    let extension = ".png";
    if (imgUrl.includes("giphy") || imgUrl.includes(".gif")) {
        extension = ".gif";
    }

    const safeName = "Hadiah_Valentine_" + giftName.replace(/[^a-zA-Z0-9]/g, '_') + extension;

    // Jalankan Download
    downloadGambar(imgUrl, safeName);

    // Tutup Modal & Lanjut
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
    document.getElementById('giftModal').classList.add('hidden');
    
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