# Boşanma sebebi mi?

> Boşanma davalarında hangi davranış kusur sayılır? **Önce tahmin et, sonra cevabı gör.**

Statik bir kusur sözlüğü. Her senaryo tek bir soruyu cevaplar — *bu davranış kusur mu?* — ve cevabı
dayanak madde, süre, ispat yolu ve kusur ağırlığıyla birlikte verir.

🔴 `KUSUR` · 🟢 `KUSUR DEĞİL` · 🟡 `DURUMA GÖRE`

## Etkileşimler

| Sayfa | Ne yapar |
| --- | --- |
| **Tahmin kartı** (ana sayfa + her senaryo) | Cevabı görmeden önce tahmin ettirir; skor tarayıcıda tutulur, görülmemiş sorular önceliklendirilir |
| **Kusur testi** `/test/` | Her seferinde farklı 12 soru, skor, yanlışların dökümü, paylaşılabilir sonuç |
| **Kusur terazisi** `/terazi/` | İki davranış yan yana: hangisi daha ağır kusur? |
| **Listeler** `/listeler/` | "Kusur sanılan ama olmayanlar", "tek başına dava sebebi olabilenler", "en ağır kusurlar", "çoğu kişinin yanıldığı senaryolar" |

## Kurulum

```bash
npm install
npm run dev
```

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run validate` | `cases.json` + `frames.json` bütünlük kontrolü |
| `npm run build` | Doğrula + `dist/` üret |

## Yeni senaryo eklemek

[`src/data/cases.json`](src/data/cases.json) dosyasına bir nesne ekleyin. Sayfa, sitemap, arama indeksi,
quiz havuzu, terazi eşleşmeleri ve "benzer senaryolar" otomatik güncellenir.

```jsonc
{
  "slug": "eve-gec-gelmek",
  "title": "Eve sürekli geç gelmek",
  "question": "Eşin sürekli eve geç gelmesi boşanma sebebi mi?",
  "verdict": "kosullu",            // "kusur" | "degil" | "kosullu"
  "frame": "evlilik-birligi",      // frames.json'daki çerçeve
  "weight": 2,                     // 1-5 kusur ağırlığı (terazi oyunu)
  "surprising": false,             // "çoğu kişinin yanıldığı" listesine girsin mi
  "alone": "birlikte",             // "tek" | "birlikte"
  "aliases": ["eve geç geliyor"],  // yalnız aramada kullanılır
  "summary": "Tek cümlelik cevap (en az 40 karakter).",
  "situation": "Durumun ne anlama geldiği.",
  "legal": "Hukuki değerlendirme."
}
```

Hukuki çerçeveler (dayanak madde, süre, ispat, sonuçlar) [`src/data/frames.json`](src/data/frames.json)
içinde bir kez tanımlanır ve senaryolara build sırasında bağlanır.

## Yayınlama

Canlı: **https://osmnnl.github.io/bosanmasebebimi/**

`master` dalına her push GitHub Pages'e otomatik dağıtılır. Adres iki değişkenle yönetilir:

```bash
SITE_URL=https://bosanmasebebimi.com BASE_PATH=/ npm run build
```

## Yasal uyarı

Bu depodaki içerik **genel bilgilendirme amaçlıdır, hukuki danışmanlık değildir**. Boşanma davalarında
sonucu belirleyen şey delil durumu ve olayın kendine özgü koşullarıdır; aynı davranış farklı dosyalarda
farklı değerlendirilebilir. `weight` alanı kanuni bir ölçü değil, içtihat eğilimini özetleyen bir göstergedir.

Şiddet veya tehdit altındaysanız: **ALO 183** (ücretsiz, 7/24) · acil durumda **155** / **112**.

## Lisans

Kod MIT. İçerik CC BY 4.0.
