# NOVA — standalone social website starter

NOVA is a responsive front-end prototype for a Facebook-inspired community website. It includes a news feed, sample stories, post creation, photo attachment, likes, comments, save-post, search, demo friend list, profile editing, and responsive mobile navigation.

## Run it

1. Extract the ZIP.
2. Open `index.html` in a modern browser, or use VS Code with the **Live Server** extension.
3. Try creating a post, liking/commenting, editing your profile, searching, and saving posts.

No build step is required. This project uses plain HTML, CSS, and JavaScript.

## Important limits

This is a **front-end demo**, not yet a production multi-user social network. Its posts/profile/friends are saved in the current browser using `localStorage`; they are not shared with other visitors. Messages are a placeholder. It does not include secure accounts, a server database, server-side permissions, password reset, moderation, or cloud photo storage. Do not collect real passwords or private user information with this demo.

## Publish the demo

### Option A — Netlify (simple)
1. Extract the ZIP on your computer.
2. Open Netlify and create an account.
3. Choose **Add new site** / **Deploy manually** (the label can change).
4. Upload the extracted project folder contents, ensuring `index.html`, `styles.css`, and `app.js` are at the published root.
5. Open the URL Netlify gives you and test on your phone.

### Option B — GitHub Pages
1. Create a GitHub repository named `nova-social`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. In repository **Settings → Pages**, select deployment from the `main` branch and root folder, then save.
4. Wait for GitHub Pages to publish and open the generated website URL.

### Option C — Cloudflare Pages
1. Upload the project to a Git repository.
2. Create a Pages project in Cloudflare and connect the repository.
3. Because this is a static site, use no build command and set the output directory to `/` or the repository root as the platform requests.
4. Deploy and test the generated URL.

Publishing the front-end makes it accessible online, but it does not add multi-user functionality.

## What is needed for a real launch

Choose a backend such as Supabase or Firebase for:
- account sign-up/sign-in and password recovery;
- user profiles;
- posts, comments, reactions and friend relationships;
- private messaging;
- image storage;
- notifications;
- server-side security rules and access policies;
- moderation, reporting, blocking, rate limits, backups and account deletion.

Never put a service-role or private secret key in browser JavaScript. Configure access rules before real users join.
