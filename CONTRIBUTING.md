# DocsPI'ye Katkıda Bulunma

DocsPI, açık kaynak bir projedir ve katkılarınız değerlidir!

## Nasıl Katkıda Bulunabilirsiniz?

### 1. Bug Raporlama
- [GitHub Issues](https://github.com/aydocs/DocsPI/issues) üzerinden hata raporu oluşturun
- Hatanın tekrarlanabilir adımlarını ekleyin
- İşletim sistemi ve DocsPI sürümünü belirtin

### 2. Özellik Önerisi
- Yeni özellik için GitHub Issues'da "Feature Request" etiketiyle açın
- Kullanım senaryosunu açıklayın

### 3. Kod Katkısı
1. Repo'yu fork edin
2. Yeni bir dal oluşturun (`git checkout -b feature/ozellik-adi`)
3. Değişikliklerinizi yapın
4. Testlerin çalıştığından emin olun
5. Pull request oluşturun

### 4. Çeviri Katkısı
- `src/i18n.js` dosyasında yeni dil ekleyin veya mevcut çevirileri iyileştirin
- RTL dilleri için (Arapça, Farsça) ekstra dikkat gösterin

## Geliştirme Ortamı Kurulumu

```bash
# Repo'yu klonlayın
git clone https://github.com/aydocs/DocsPI.git
cd DocsPI

# Bağımlılıkları kurun
npm install

# Geliştirme modunu başlatın
npm run dev

# Tauri mobilitesi ile
npm run tauri dev
```

## Kod Standartları

- **JavaScript**: ES2020+, JSDoc yorumları
- **React**: Functional components, hooks kullanımı
- **CSS**: Tailwind CSS, responsive tasarım
- **Commit**: [Conventional Commits](https://www.conventionalcommits.org/) formatı

### Commit Formatı
```
<type>(<scope>): <description>

Örnekler:
feat(i18n): Japonca dil desteği eklendi
fix(proxy): DNS çözümleme hatası düzeltildi
docs(readme): Kurulum adımları güncellendi
```

## Testing

```bash
# Testleri çalıştırın
npm test

# Build testi
npm run build

# Tauri build
npm run tauri build
```

## Sorularınız mı var?

[Discord sunucumuzdan](https://discord.gg/aydocs) bize ulaşabilirsiniz.

Teşekkürler! 🙏



