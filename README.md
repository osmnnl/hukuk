# Hakkını Bil

> Günlük hayatta karşılaşılan hukuki durumlar için kısa ve net cevaplar.
> Bağımsız mikro siteler, tek repoda, tek yayında.

**Canlı:** https://osmnnl.github.io/hukuk/

## Siteler

| Site | Soru | Etkileşim |
| --- | --- | --- |
| [Tüketici Hakkım](https://osmnnl.github.io/hukuk/tuketici-hakkim/) | Bu durumda hakkım var mı? | Senaryo sözlüğü, başvuru rehberi |
| [Boşanma sebebi mi?](https://osmnnl.github.io/hukuk/bosanma-sebebi-mi/) | Sence bu davranış kusur mu? | Tahmin oyunu, 12 soruluk test, kusur terazisi |
| [Kirada kim haklı?](https://osmnnl.github.io/hukuk/kirada-kim-hakli/) | Kiracı mı, ev sahibi mi? | Kim haklı?, tahliye testi, artış hesabı, ihtarname |

Kapak sayfasında **tüm sitelerde birden arama** yapılır; her sitenin başlığından kapağa dönülür.

## Yapı

```
hukuk/
├── sites.json              ← site kataloğu (kapak sayfası buradan üretilir)
├── sites/
│   ├── tuketici-hakkim/    ← bağımsız Astro projesi
│   ├── bosanma-sebebi-mi/
│   └── kirada-kim-hakli/
├── hub/                    ← kapak sayfası + birleşik arama
└── scripts/build-all.mjs   ← hepsini derler, dist/ altında birleştirir
```

Her site kendi başına ayakta: kendi verisi, kendi tasarımı, kendi doğrulayıcısı.
Ortak olan yalnız derleme ve yayın.

## Komutlar

```bash
npm install
npm run dev -- kirada-kim-hakli   # tek siteyi geliştirme modunda aç
npm run dev                       # site listesini göster
npm run validate                  # tüm sitelerin verisini doğrula
npm run build                     # hepsini derle → dist/
```

## Yayın

`master`'a her push GitHub Pages'e dağıtılır. Adres iki değişkenle yönetilir:

| Değişken | Varsayılan |
| --- | --- |
| `SITE_URL` | `https://osmnnl.github.io` |
| `BASE_PATH` | `/hukuk` |

Bir siteyi kendi alan adına taşımak için o sitenin klasöründe
`SITE_URL=https://site.com BASE_PATH=/ npx astro build` yeterlidir — projeler bağımsızdır.

## Yeni site eklemek

1. `sites/<slug>/` altına Astro projesini koyun (mevcut bir siteyi şablon alabilirsiniz).
2. `sites.json`'a bir kayıt ekleyin (`slug`, `name`, `question`, `blurb`, `icon`, `accent`, `tools`).
3. `npm run build` — kapak sayfası, birleşik arama ve yayın otomatik güncellenir.

## Yol haritası

Kıdem hakkım · Delil olur mu? · Trafikte kim haklı? · Bu tazminat kaç para? ·
Ne kadar sürer? · Miras kimin? · Emekli olabilir miyim?

## Yasal uyarı

Bu sitelerdeki bilgiler **genel bilgilendirme amaçlıdır, hukuki danışmanlık değildir** ve
avukat–müvekkil ilişkisi doğurmaz. Her olayın sonucu kendi koşullarına ve delil durumuna göre
değişir; mevzuat ve parasal sınırlar zamanla güncellenir.

## Lisans

Kod MIT. İçerik CC BY 4.0.
