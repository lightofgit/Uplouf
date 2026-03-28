# Tempo Genesis Uploader

999 adet NFT metadata dosyasını Pinata IPFS'e yükleyen Next.js uygulaması.

## Vercel'e Deploy Etme

### 1. GitHub'a yükle
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/KULLANICI_ADI/tempo-uploader.git
git push -u origin main
```

### 2. Vercel'e bağla
- [vercel.com](https://vercel.com) → "New Project" → GitHub repo'yu seç → Import

### 3. Environment Variables ekle
Vercel dashboard → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `PINATA_API_KEY` | Pinata API Key'in |
| `PINATA_SECRET_KEY` | Pinata Secret Key'in |

### 4. Deploy et
Environment variables'ı kaydettikten sonra "Redeploy" yap.

## Kullanım

Deploy sonrası vercel URL'ine git → "Yüklemeyi Başlat" butonuna bas → baseURI'yi kopyala.
