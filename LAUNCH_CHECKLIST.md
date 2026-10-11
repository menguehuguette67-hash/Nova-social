# NOVA launch checklist

## Before publishing the demo
- [ ] Extract the ZIP.
- [ ] Keep `index.html`, `styles.css`, and `app.js` together in the same folder.
- [ ] Open `index.html` and test on desktop and mobile.
- [ ] Test create post, photo attachment (small image only), like, comment, save, search, and profile edit.
- [ ] Publish through Netlify, GitHub Pages, or Cloudflare Pages.

## Before accepting real users
- [ ] Add a backend database and secure authentication.
- [ ] Enforce authorization on the server/database, not only in browser code.
- [ ] Add private message storage with access restricted to conversation members.
- [ ] Add cloud image storage and file type/size validation.
- [ ] Add report, block, moderation and account deletion tools.
- [ ] Add privacy policy and terms appropriate to the intended audience and region.
- [ ] Test security rules using separate test accounts.
- [ ] Never store passwords directly or publish secret API keys in client code.
