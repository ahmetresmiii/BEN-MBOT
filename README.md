# BEN-MBOT
# BEN-MBOT 🚀

**BEN-MBOT**, bot projelerini **Render** platformu üzerinde 7/24 canlı (**Live**) ve kesintisiz bir şekilde çalıştırmak amacıyla özel olarak optimize edilmiş, güçlü ve esnek bir bot altyapısıdır. 

Bu proje, yerel ortamdaki bot geliştirme süreçlerini bulut ortamına taşımak ve Render'ın sunduğu altyapı servislerinden maksimum verim alarak botu sürekli aktif tutmak için yapılandırılmıştır.

---

## 🌟 Özellikler

* **Render Entegrasyonu:** Render üzerinde kolayca konumlandırılabilmesi için optimize edilmiş port dinleme (`Port Listening`) ve `Web Service` uyumluluğu.
* **7/24 Kesintisiz Çalışma (Uptime):** Render'ın ücretsiz veya ücretli planlarında uyku moduna geçişi engelleyecek şekilde entegre edilebilen ping/canlı tutma mekanizması altyapısı.
* **Gelişmiş Çevre Değişkenleri (Environment Variables) Desteği:** Tokenlar, API anahtarları ve hassas veriler `.env` dosyası ve Render Dashboard üzerinden güvenle yönetilir.
* **Hafif ve Hızlı:** Minimum kaynak tüketimi ve maksimum performans hedefleyen optimize edilmiş kod yapısı.

---

## 🛠️ Kurulum ve Yerel Çalıştırma

Projeyi yerel bilgisayarınızda test etmek veya geliştirmek için aşağıdaki adımları takip edebilirsiniz:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/ahmetresmiii/BEN-MBOT.git
    cd BEN-MBOT
    ```

2.  **Bağımlılıkları Yükleyin:**
    *(Projenizin diline uygun olan komutu kullanın)*
    ```bash
    # Node.js kullanıyorsanız:
    npm install

    # Python kullanıyorsanız:
    pip install -r requirements.txt
    ```

3.  **Çevre Değişkenlerini Ayarlayın:**
    Projenin kök dizininde bir `.env` dosyası oluşturun ve gerekli kimlik bilgilerini ekleyin:
    ```env
    BOT_TOKEN=your_secret_token_here
    PORT=3000
    ```

4.  **Botu Başlatın:**
    ```bash
    # Node.js için:
    npm start

    # Python için:
    python main.py
    ```

---

## 🚀 Render Üzerinde Canlıya Alma (Deployment)

Botu **Render** üzerinde başarıyla canlıya (Live) almak için aşağıdaki adımları izleyin:

1.  [Render Dashboard](https://dashboard.render.com/) sayfasına gidin ve giriş yapın.
2.  **"New +"** butonuna tıklayarak **"Web Service"** seçeneğini seçin.
3.  GitHub hesabınızı bağlayın ve `BEN-MBOT` deposunu seçin.
4.  Aşağıdaki yapılandırma ayarlarını uygulayın:
    * **Runtime:** `Node` veya `Python` *(Projenizin diline göre)*
    * **Build Command:** `npm install` veya `pip install -r requirements.txt`
    * **Start Command:** `npm start` veya `python main.py`
5.  **Advanced** bölümüne gelerek **Environment Variables** (Çevre Değişkenleri) kısmına `.env` dosyanızdaki tüm anahtar-değer çiftlerini (Örn: `BOT_TOKEN`) ekleyin.
6.  **"Deploy Web Service"** butonuna tıklayarak botunuzu canlıya alın.

> 💡 **İpucu:** Ücretsiz Render planlarında botun 15 dakika işlem yapılmadığında uyku moduna geçmesini önlemek için, Render'ın size verdiği web servis URL'sini [UptimeRobot](https://uptimerobot.com/) gibi bir servise ekleyerek 5 dakikada bir ping atılmasını sağlayabilirsiniz.

---

## 👤 Geliştirici

* **Ahmet Mesrur Şahin** - [GitHub Profile](https://github.com/ahmetresmiii)

---

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile korunmaktadır.
