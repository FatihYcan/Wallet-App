// Gelir Formu Selectors
const gelirFormu = document.getElementById("gelir-formu");
const gelirTarih = document.getElementById("gelir-tarih");
const gelirMiktar = document.getElementById("gelir-miktar");
const gelirAlani = document.getElementById("gelir-alani");

// Gider Formu Selectors
const giderFormu = document.getElementById("gider-formu");
const giderTarih = document.getElementById("gider-tarih");
const giderMiktar = document.getElementById("gider-miktar");
const giderAlani = document.getElementById("gider-alani");

// Gelir Gider Tablosu Selectors
const gelirGiderTablosu = document.getElementById("gelir-gider-tablosu");

// Hesap Selector
const geliriniz = document.getElementById("geliriniz");
const gideriniz = document.getElementById("gideriniz");
const kalan = document.getElementById("kalan");
const kalanTh = document.getElementById("kalanTh");

// Tümünü Temizle Selectors
const temizleBtn = document.getElementById("temizle-btn");

// Variables
let gelirListesi = [];
let giderListesi = [];

window.addEventListener("load", () => {
  gelirTarih.valueAsDate = new Date();
  gelirListesi = JSON.parse(localStorage.getItem("gelirler")) || [];
  gelirListesi.forEach((gelir) => gelirDomaYaz(gelir));
  giderTarih.valueAsDate = new Date();
  giderListesi = JSON.parse(localStorage.getItem("giderler")) || [];
  giderListesi.forEach((gider) => giderDomaYaz(gider));
  gelirGiderKalanToplami();
  siralaTablo();
});

gelirFormu.addEventListener("submit", (e) => {
  e.preventDefault(); // reloadu engelle
  if (!gelirAlani.value.trim()) {
    alert("Lütfen bir bilgi giriniz");
  } else {
    const yeniGelir = {
      id: new Date().getTime(),
      tarih: new Date(gelirTarih.value).toLocaleDateString(),
      miktar: gelirMiktar.value,
      alan: gelirAlani.value,
    };
    gelirFormu.reset();
    gelirTarih.valueAsDate = new Date();
    gelirListesi.push(yeniGelir);
    localStorage.setItem("gelirler", JSON.stringify(gelirListesi));
    gelirDomaYaz(yeniGelir);
    gelirGiderKalanToplami();
    siralaTablo();
  }
});

giderFormu.addEventListener("submit", (e) => {
  e.preventDefault(); // reloadu engelle
  if (!giderAlani.value.trim()) {
    alert("Lütfen bir bilgi giriniz");
  } else {
    const yeniGider = {
      id: new Date().getTime(),
      tarih: new Date(giderTarih.value).toLocaleDateString(),
      miktar: giderMiktar.value,
      alan: giderAlani.value,
    };
    giderFormu.reset();
    giderTarih.valueAsDate = new Date();
    giderListesi.push(yeniGider);
    localStorage.setItem("giderler", JSON.stringify(giderListesi));
    giderDomaYaz(yeniGider);
    gelirGiderKalanToplami();
    siralaTablo();
  }
});

// Geliri Doma Yazma
const gelirDomaYaz = ({ id, tarih, miktar, alan }) => {
  const tr = document.createElement("tr");

  const th = document.createElement("th");
  th.className = "text-success fw-bold";
  th.textContent = tarih;
  tr.appendChild(th);

  const appendTd = (content) => {
    const td = document.createElement("td");
    td.textContent = content;
    td.className = "text-success fw-bold";
    return td;
  };

  tr.appendChild(appendTd(alan));
  tr.appendChild(appendTd(miktar));

  const lastTd = () => {
    const td = document.createElement("td");
    const icon = document.createElement("i");
    icon.id = id;
    icon.className = "fa-solid fa-trash-can text-danger";
    icon.type = "button";
    icon.style.cursor = "pointer";
    td.appendChild(icon);
    return td;
  };

  tr.appendChild(lastTd());

  gelirGiderTablosu.appendChild(tr);
};

// Gideri Doma Yazma
const giderDomaYaz = ({ id, tarih, miktar, alan }) => {
  const tr = document.createElement("tr");

  const th = document.createElement("th");
  th.className = "text-danger fw-bold";
  th.textContent = tarih;
  tr.appendChild(th);

  const appendTd = (content) => {
    const td = document.createElement("td");
    td.textContent = content;
    td.className = "text-danger fw-bold";
    return td;
  };

  tr.appendChild(appendTd(alan));
  tr.appendChild(appendTd(miktar));

  const lastTd = () => {
    const td = document.createElement("td");
    const icon = document.createElement("i");
    icon.id = id;
    icon.className = "fa-solid fa-trash-can text-danger";
    icon.type = "button";
    icon.style.cursor = "pointer";
    td.appendChild(icon);
    return td;
  };

  tr.appendChild(lastTd());

  gelirGiderTablosu.appendChild(tr);
};

const gelirGiderKalanToplami = () => {
  // Gelirler Toplamı
  const gelirToplami = gelirListesi.reduce(
    (sum, price) => sum + Number(price.miktar),
    0
  );

  // Giderler Toplamı
  const giderToplami = giderListesi.reduce(
    (sum, price) => sum + Number(price.miktar),
    0
  );

  // Geliri Gideri ve Kalanı Ekrana Yazma
  geliriniz.innerText = new Intl.NumberFormat().format(gelirToplami);
  gideriniz.innerText = new Intl.NumberFormat().format(giderToplami);
  kalan.innerText = new Intl.NumberFormat().format(gelirToplami - giderToplami);

  if (kalan.innerText < 0) {
    kalanTh.className = "bg-danger";
    kalan.className = "bg-danger";
  } else if (kalan.innerText > 0) {
    kalanTh.className = "bg-success";
    kalan.className = "bg-success";
  } else {
    kalanTh.className = "";
    kalan.className = "";
  }
};

gelirGiderTablosu.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.closest("tr").remove();
  }

  const id = e.target.id;

  giderListesi = giderListesi.filter((gider) => gider.id != id);
  gelirListesi = gelirListesi.filter((gelir) => gelir.id != id);

  localStorage.setItem("giderler", JSON.stringify(giderListesi));
  localStorage.setItem("gelirler", JSON.stringify(gelirListesi));

  gelirGiderKalanToplami();
  siralaTablo();
});

temizleBtn.addEventListener("click", () => {
  if (confirm("Silmek istediğine emin misin ?")) {
    gelirListesi = [];
    localStorage.removeItem("gelirler");
    giderListesi = [];
    localStorage.removeItem("giderler");
    gelirGiderTablosu.innerHTML = ""; // innerHTML kullanarak tabloyu temizle
    gelirGiderKalanToplami();
    siralaTablo();
  }
});

// Tabloyu tarih sırasına göre sıralama işlevi
function siralaTablo() {
  const rows = Array.from(gelirGiderTablosu.querySelectorAll("tr"));
  rows.sort((a, b) => {
    const tarihA = parseDate(a.querySelector("th").textContent);
    const tarihB = parseDate(b.querySelector("th").textContent);
    return tarihB - tarihA; // Tarihlere göre azalan sıralama
  });

  // Sıralanmış satırları tekrar tabloya ekle
  rows.forEach((row) => gelirGiderTablosu.appendChild(row));
}

// Tarih formatını uygun hale getirme fonksiyonu
function parseDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
}
