// --- DATA MENU ---
const menuItems = [
    {
        id: 1,
        name: "Espresso",
        description: "Strong and bold espresso shot",
        price: 15000,
        category: "Kopi",
        image: "espresso.jpg", // Pastikan nama file gambar sesuai
        rating: 4.8
    },
    {
        id: 2,
        name: "Cappuccino",
        description: "Perfect blend of espresso and steamed milk",
        price: 25000,
        category: "Kopi",
        image: "cappuccino.jpg", // Pastikan nama file gambar sesuai
        rating: 4.9
    },
    {
        id: 3,
        name: "Kopi Hitam",
        description: "Kopi hitam klasik yang menyegarkan",
        price: 20000,
        category: "Kopi",
        image: "kopihitam.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.7
    },
    {
        id: 4,
        name: "Es Teh Manis",
        description: "Teh hitam manis dengan es batu",
        price: 15000,
        category: "Minuman",
        image: "estehmanis.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.5
    },
    {
        id: 5,
        name: "Nasi Goreng Spesial",
        description: "Nasi goreng dengan bumbu rahasia",
        price: 35000,
        category: "Makanan",
        image: "nasigoreng.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.6
    },
    {
        id: 6,
        name: "Mie Ayam",
        description: "Mie ayam gurih dengan bakso",
        price: 30000,
        category: "Makanan",
        image: "mieayam.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.4
    },
    {
        id: 7,
        name: "Latte",
        description: "Espresso dengan susu steamed dan foam",
        price: 28000,
        category: "Kopi",
        image: "latte.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.7
    },
    {
        id: 8,
        name: "Green Tea Latte",
        description: "Perpaduan green tea premium dan susu",
        price: 30000,
        category: "Minuman",
        image: "greentealatte.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.8
    },
    {
        id: 9,
        name: "Roti Bakar Keju",
        description: "Roti bakar dengan lelehan keju mozarella",
        price: 22000,
        category: "Makanan",
        image: "rotibakar.jpg", // Ganti dengan nama file gambar Anda
        rating: 4.3
    },
    // Tambahkan item menu lainnya di sini
];

// --- KONFIGURASI WHATSAPP ANDA ---
const WHATSAPP_NUMBER = "6283899430002"; // Ganti dengan nomor WhatsApp Anda (diawali kode negara tanpa +)

// --- Variabel Global ---
let cart = {}; // Objek untuk menyimpan item di keranjang {itemId: quantity}

const menuContainer = document.querySelector('.menu-container');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartCountSpan = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalPriceSpan = document.getElementById('cart-total-price');
const emptyCartMessage = document.getElementById('empty-cart-message');

// --- Fungsi Utama ---

// Fungsi untuk memuat dan menampilkan item menu
function loadMenuItems(filterCategory = "Semua") {
    menuContainer.innerHTML = ''; // Kosongkan container sebelum memuat
    const filteredItems = filterCategory === "Semua" ? menuItems : menuItems.filter(item => item.category === filterCategory);

    filteredItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');
        menuItemDiv.dataset.id = item.id; // Menyimpan ID item di elemen HTML

        const currentQuantity = cart[item.id] || 0; // Ambil jumlah dari keranjang, default 0

        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="description">${item.description}</p>
            <div class="rating">
                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(item.rating))}
                ${item.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                (${item.rating})
            </div>
            <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
            <div class="quantity-control">
                <button class="minus-btn" data-id="${item.id}" ${currentQuantity === 0 ? 'disabled' : ''}>-</button>
                <span class="quantity-display" data-id="${item.id}">${currentQuantity}</span>
                <button class="plus-btn" data-id="${item.id}">+</button>
            </div>
        `;
        menuContainer.appendChild(menuItemDiv);
    });

    // Tambahkan event listener untuk tombol tambah/kurang setelah menu dimuat
    attachQuantityControlListeners();
}

// Fungsi untuk melampirkan event listener ke tombol tambah/kurang
function attachQuantityControlListeners() {
    document.querySelectorAll('.plus-btn').forEach(button => {
        button.onclick = (event) => updateQuantity(parseInt(event.target.dataset.id), 1);
    });
    document.querySelectorAll('.minus-btn').forEach(button => {
        button.onclick = (event) => updateQuantity(parseInt(event.target.dataset.id), -1);
    });
}

// Fungsi untuk memperbarui jumlah item di keranjang
function updateQuantity(itemId, change) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    if (cart[itemId] === undefined) {
        cart[itemId] = 0;
    }

    cart[itemId] += change;

    if (cart[itemId] < 0) {
        cart[itemId] = 0;
    }

    // Jika jumlah jadi 0, hapus dari keranjang
    if (cart[itemId] === 0) {
        delete cart[itemId];
    }

    // Perbarui tampilan jumlah di menu utama
    const quantityDisplay = document.querySelector(`.quantity-display[data-id="${itemId}"]`);
    if (quantityDisplay) {
        quantityDisplay.textContent = cart[itemId] || 0;
        const minusBtn = quantityDisplay.previousElementSibling;
        if (minusBtn) {
            minusBtn.disabled = (cart[itemId] || 0) === 0;
        }
    }

    updateCartDisplay();
}

// Fungsi untuk memperbarui tampilan keranjang belanja dan ikon hitungan
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let totalItemsInCart = 0;
    let totalPrice = 0;
    const itemsInCart = Object.keys(cart).filter(id => cart[id] > 0);

    if (itemsInCart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        itemsInCart.forEach(id => {
            const item = menuItems.find(i => i.id === parseInt(id));
            if (item) {
                const quantity = cart[id];
                totalItemsInCart += quantity;
                totalPrice += item.price * quantity;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="price">Rp ${(item.price * quantity).toLocaleString('id-ID')}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeCartItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            }
        });
    }

    cartCountSpan.textContent = totalItemsInCart;
    cartTotalPriceSpan.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

// Fungsi untuk menghapus item dari keranjang (di sidebar)
function removeCartItem(itemId) {
    delete cart[itemId];
    // Pastikan quantity display di menu utama juga direset
    const quantityDisplay = document.querySelector(`.quantity-display[data-id="${itemId}"]`);
    if (quantityDisplay) {
        quantityDisplay.textContent = 0;
        const minusBtn = quantityDisplay.previousElementSibling;
        if (minusBtn) {
            minusBtn.disabled = true;
        }
    }
    updateCartDisplay();
}

// Fungsi untuk membuka/menutup sidebar keranjang
function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Fungsi untuk mengirim pesanan via WhatsApp
function sendOrderViaWhatsApp() {
    const itemsInCart = Object.keys(cart).filter(id => cart[id] > 0);
    if (itemsInCart.length === 0) {
        alert("Keranjang Anda kosong. Silakan pilih menu terlebih dahulu.");
        return;
    }

    let orderDetails = "Halo, saya ingin memesan:\n\n";
    let totalPrice = 0;

    itemsInCart.forEach(id => {
        const item = menuItems.find(i => i.id === parseInt(id));
        const quantity = cart[id];
        if (item && quantity > 0) {
            orderDetails += `- ${item.name} (${quantity}x) = Rp ${(item.price * quantity).toLocaleString('id-ID')}\n`;
            totalPrice += item.price * quantity;
        }
    });

    orderDetails += `\nTotal Harga: Rp ${totalPrice.toLocaleString('id-ID')}\n\n`;
    orderDetails += "Mohon konfirmasi pesanan ini. Terima kasih!";

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');

    // Opsional: Setelah pesanan dikirim, Anda bisa mengosongkan keranjang
    // cart = {};
    // updateCartDisplay();
    // loadMenuItems(document.querySelector('.category-btn.active').dataset.category); // Muat ulang menu agar quantity display reset
}

// --- Event Listeners ---

// Event listener untuk tombol kategori
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        loadMenuItems(button.dataset.category);
    });
});

// --- Inisialisasi ---
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems(); // Muat semua menu saat halaman pertama kali dimuat
    updateCartDisplay(); // Perbarui tampilan keranjang saat halaman dimuat
});