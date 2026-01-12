# 🌐 Domain Setup Guide for Client

## 📋 Two Domains Required

Your real estate website needs **TWO separate domains**:

### 1️⃣ **Main Website Domain** (for clients to browse properties)
- **Example:** `youragency.com` or `yourname-realestate.com`
- **Purpose:** Public-facing website where customers see listings
- **What goes here:** Homepage, property listings, about page, etc.
- **Access:** Anyone can visit

### 2️⃣ **Admin/API Domain** (subdomain for admin panel & backend)
- **Example:** `admin.youragency.com` or `api.youragency.com`
- **Purpose:** Admin dashboard + API endpoint for the website
- **What goes here:** Property management, lead tracking, analytics
- **Access:** Only authorized admins can access

---

## 📝 Tell Your Client This:

> "Please provide me with TWO domains:
> 
> 1. **Main Domain** - This is your primary website that customers will visit to see your properties
>    - Example: `concepcionpena.com` or `pena-realty.com`
> 
> 2. **Admin/API Domain** - This is a subdomain for your admin dashboard and the website backend
>    - Example: `admin.concepcionpena.com` or `api.concepcionpena.com`
>    - OR you can use a subdomain of your main domain (recommended)
> 
> Both must be registered at the same registrar (GoDaddy, Namecheap, etc.) for easier DNS management."

---

## 🔧 DNS Configuration Steps

### **Step 1: Get Your Server IP Address**
- Contact your hosting provider (Vercel, Railway, DigitalOcean, etc.)
- Ask for your **server's IP address** (e.g., `123.45.67.89`)

### **Step 2: Access Domain Registrar** 
Go to where they bought the domain:
- GoDaddy
- Namecheap
- Domain.com
- Google Domains
- Any other registrar

### **Step 3: Update DNS Records**

Login to the domain registrar's dashboard and find **DNS Settings** or **Manage DNS**.

#### **A Records to Add:**

Add these A records pointing to your server IP:

| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| A | `concepcionpena.com` | `123.45.67.89` | 3600 |
| A | `www.concepcionpena.com` | `123.45.67.89` | 3600 |
| A | `admin.concepcionpena.com` | `123.45.67.89` | 3600 |

**Example in GoDaddy:**
```
Name: concepcionpena.com
Type: A
Points to: 123.45.67.89
TTL: 3600

Name: www
Type: A
Points to: 123.45.67.89
TTL: 3600

Name: admin
Type: A
Points to: 123.45.67.89
TTL: 3600
```

### **Step 4: Wait for DNS to Propagate**
- Takes **5 minutes to 48 hours** (usually 15-30 minutes)
- Check status: https://www.whatsmydns.net/
- Enter your domain and see if it resolves to your server IP

### **Step 5: Verify Domains**
Once DNS propagates, test:
```
https://concepcionpena.com          ← Main website
https://www.concepcionpena.com      ← Main website with www
https://admin.concepcionpena.com    ← Admin dashboard
```

---

## ⚙️ Server Configuration

Once domains are pointing to your server, you need to update your server files:

### **Update nginx.conf** (if using nginx)
```bash
# File: deploy/nginx.conf
server_name concepcionpena.com www.concepcionpena.com;
server_name admin.concepcionpena.com;
```

### **Update .env files**
```bash
# server/.env
CORS_ORIGIN=https://concepcionpena.com,https://www.concepcionpena.com,https://admin.concepcionpena.com

# client/.env.production
VITE_API_URL=https://admin.concepcionpena.com
```

### **SSL Certificates (HTTPS)**
After DNS is set up, run:
```bash
certbot --nginx -d concepcionpena.com -d www.concepcionpena.com -d admin.concepcionpena.com
```

---

## 📊 Example DNS Setup

**Client's Domain:** `concepcionpena.com`

### DNS Records Needed:

| Record Type | Name/Host | Value | Purpose |
|-------------|-----------|-------|---------|
| A | @ or concepcionpena.com | 123.45.67.89 | Main website |
| A | www | 123.45.67.89 | www version |
| A | admin | 123.45.67.89 | Admin dashboard |
| A | api | 123.45.67.89 | (Optional) If using separate API subdomain |

---

## ✅ Verification Checklist

- [ ] Client bought TWO domains
- [ ] DNS A records added pointing to server IP
- [ ] DNS propagated (test at whatsmydns.net)
- [ ] Can access https://domain.com (main website)
- [ ] Can access https://admin.domain.com (admin panel)
- [ ] SSL certificates installed (HTTPS working)
- [ ] Server .env files updated with new domains
- [ ] nginx/server config updated with new domains

---

## 🆘 Common Issues

### "Connection Refused / Cannot Access"
- ❌ DNS not propagated yet → Wait 15-30 minutes
- ❌ Wrong IP address → Verify with hosting provider
- ❌ Firewall blocking → Contact hosting provider

### "SSL Certificate Error"
- ❌ Need to run certbot after DNS is ready
- ❌ Certificate not renewed → Renew with: `certbot renew`

### "CORS Error When Submitting Forms"
- ❌ Update CORS_ORIGIN in server/.env with correct domain

---

## 📞 Information You Need From Client

1. **Domain names purchased**
2. **Registrar** (where they bought domains)
3. **Registrar login details** (for DNS setup)

## 📞 Information to Give Hosting Provider

1. **Server IP address** (to give to client for DNS)
2. **Domain names** (to configure SSL)

---

## 💡 Pro Tips

- Use same registrar for both domains → Easier DNS management
- Make admin domain a subdomain → Simpler to manage
- Always use HTTPS (SSL certificates)
- Keep CORS_ORIGIN updated in server for all domains
- Test forms after switching domains to ensure emails work

---

## 🚀 Full Deployment Checklist

- [ ] Domains purchased
- [ ] DNS A records configured
- [ ] Server IP obtained from hosting provider
- [ ] nginx.conf updated with new domains
- [ ] server/.env updated (CORS_ORIGIN, SENDGRID, etc.)
- [ ] client/.env.production updated (VITE_API_URL)
- [ ] SSL certificates installed
- [ ] Database backup created
- [ ] Tested all forms (contact, popup, let's connect)
- [ ] Email notifications working
- [ ] Admin login working
- [ ] Forms submitting to database
- [ ] Emails sending to admin

---

