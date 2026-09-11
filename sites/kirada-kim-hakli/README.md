# Kirada kim haklı?

> Kira uyuşmazlıklarında iki tarafın da iddiası var. **Sen karar ver, sonra kanunun ne dediğini gör.**

Statik bir senaryo sözlüğü + üç pratik araç. Her senaryoda kiracının ve ev sahibinin iddiası
yan yana durur; cevap `KİRACI` · `EV SAHİBİ` · `KISMEN` olarak verilir ve dayanak maddeyle açıklanır.

## Araçlar

| Sayfa | Ne yapar |
| --- | --- |
| **Kim haklı?** (ana sayfa + her senaryo) | İki iddia gösterilir, taraf seçilir, cevap açılır. Skor tarayıcıda tutulur, görülmemiş senaryolar önceliklendirilir |
| **Tahliye testi** `/tahliye-testi/` | 4 soruda hangi kanuni sebebin gündeme geldiğini, usulü ve süreleri gösterir (dallanan karar ağacı) |
| **Artış hesabı** `/kira-artisi/` | Kira + TÜFE oranı → yasal üst sınır, artış tutarı ve istenen tutarın sınırı aşıp aşmadığı |
| **İhtar oluştur** `/ihtarname/` | 5 tür için kopyalanabilir/indirilebilir ihtarname taslağı: kira ödememe, depozito iadesi, artış bildirimi, yenilememe bildirimi, onarım talebi |

## Kurulum

```bash
npm install
npm run dev
```

| Komut | Ne yapar |
| --- | --- |
| `npm run validate` | `cases.json` + `frames.json` bütünlük kontrolü |
| `npm run build` | Doğrula + `dist/` üret |

## Yeni senaryo eklemek

[`src/data/cases.json`](src/data/cases.json)'a bir nesne ekleyin:

```jsonc
{
  "slug": "depozito-iade-edilmiyor",
  "title": "Depozito geri verilmiyor",
  "question": "Ev sahibi depozitoyu iade etmek zorunda mı?",
  "verdict": "kiraci",              // "kiraci" | "evsahibi" | "ikisi"
  "frame": "depozito",              // frames.json'daki başlık
  "surprising": false,
  "aliases": ["depozito iadesi"],
  "kiraci": "Eve zarar vermedim, depozitom iade edilmeli.",
  "evsahibi": "Evde eksikler var, depozitoyu kesiyorum.",
  "summary": "Tek cümlelik cevap.",
  "situation": "Durumun açıklaması.",
  "legal": "Kanun ne diyor.",
  "tip": "Pratik ipucu."
}
```

## Yayınlama

Canlı: **https://osmnnl.github.io/kiradakimhakli/**

`master`'a her push GitHub Pages'e otomatik dağıtılır. Adres iki değişkenle yönetilir:

```bash
SITE_URL=https://kiradakimhakli.com BASE_PATH=/ npm run build
```

## Yasal uyarı

İçerik **genel bilgilendirme amaçlıdır, hukuki danışmanlık değildir**. Kira uyuşmazlıklarında sonucu
sözleşmenizin içeriği, tebligat usulü ve delil durumu belirler. Artış oranları ve parasal sınırlar
mevzuat değişiklikleriyle güncellenir; dönemsel geçici düzenlemeler yapılabilmektedir. İhtarname
oluşturucu genel bir **taslak** üretir — göndermeden önce bir avukata kontrol ettirin.

## Lisans

Kod MIT. İçerik CC BY 4.0.
