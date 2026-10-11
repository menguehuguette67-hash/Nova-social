(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const STORE = "nova_demo_v1";
  const starterPosts = [
    {id:"welcome",name:"NOVA Team",initial:"N",handle:"@nova",time:"Pinned welcome",text:"Welcome to NOVA ✨ A fresh space to share your moments, discover new ideas, and stay close to your community. Tell us what you’re excited about today! #NOVACommunity",likes:12,liked:false,comments:[{name:"Amina",text:"Happy to be here! 💙"}],color:"linear-gradient(145deg,#8ab7ff,#4f72e8)",image:""},
    {id:"weekend",name:"Amina Bello",initial:"A",handle:"@amina.b",time:"25 min ago",text:"A little reminder to pause, enjoy the small things, and make room for joy. What made you smile today? ☀️ #WeekendMoments",likes:8,liked:false,comments:[],color:"linear-gradient(145deg,#ffc9a8,#ed8a88)",image:""},
    {id:"learning",name:"David M.",initial:"D",handle:"@davidm",time:"1 hr ago",text:"One new thing learned every day adds up. What are you learning this week? 📚 #KeepLearning",likes:5,liked:false,comments:[],color:"linear-gradient(145deg,#b7e8d5,#379e91)",image:""}
  ];
  let state = loadState();
  let selectedPhoto = "";
  let newestFirst = true;
  let currentView = "feed";
  function loadState() {
    try { const saved = JSON.parse(localStorage.getItem(STORE)); if (saved && Array.isArray(saved.posts)) return {...saved, friends:saved.friends||[], saved:saved.saved||[]}; } catch(e) {}
    return {name:"Your Name",handle:"@you",initial:"Y",bio:"Getting started on NOVA.",posts:starterPosts.map(p=>({...p,comments:[...p.comments]})),friends:[],saved:[],notifications:[]};
  }
  function persist(){ try { localStorage.setItem(STORE, JSON.stringify(state)); } catch(e) { toast("Browser storage is full. Try removing a large photo."); } }
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function avatar(initial,color="linear-gradient(145deg,#ffcfad,#ff9f87)"){return `<div class="avatar" style="background:${color}">${escapeHTML(initial||"?")}</div>`;}
  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400);}
  function setProfileBits(){ $("#sidebarName").textContent=state.name;$("#sidebarHandle").textContent=state.handle;$("#profileButton").textContent=state.initial; $$(".composer-top .avatar").forEach(el=>el.textContent=state.initial); }
  function timeSort(posts){return newestFirst?[...posts].reverse():posts;}
  function renderFeed(query=""){
    const q=query.trim().toLowerCase();
    let posts=timeSort(state.posts).filter(p=>`${p.name} ${p.text} ${p.handle}`.toLowerCase().includes(q));
    if(currentView==="saved") posts=posts.filter(p=>state.saved.includes(p.id));
    const feed=$("#feed");
    if(!posts.length){feed.innerHTML=`<div class="empty-state"><strong>Nothing here yet</strong>${currentView==="saved"?"Save a post and it will appear here.":"Try another search or be the first to share something."}</div>`;return;}
    feed.innerHTML=posts.map(p=>`<article class="post" data-post="${escapeHTML(p.id)}">
      <div class="post-header">${avatar(p.initial,p.color)}<div class="post-user"><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.handle)} · ${escapeHTML(p.time)}</small></div>
      <button class="more-btn" data-action="more" title="Post options" aria-label="Post options">•••</button></div>
      <p class="post-copy">${escapeHTML(p.text)}</p>
      ${p.image?`<img class="post-image" src="${p.image}" alt="Photo attached to post">`:""}
      <div class="post-stats"><span>💙 ${p.likes} likes</span><span>${p.comments.length} comments</span></div>
      <div class="post-actions"><button class="post-action ${p.liked?"liked":""}" data-action="like">♥ ${p.liked?"Liked":"Like"}</button><button class="post-action" data-action="comment">▢ Comment</button><button class="post-action" data-action="share">↗ Share</button><button class="post-action" data-action="save">${state.saved.includes(p.id)?"★ Saved":"☆ Save"}</button></div>
      <div class="comment-list">${p.comments.map(c=>`<div class="comment"><strong>${escapeHTML(c.name)}:</strong> ${escapeHTML(c.text)}</div>`).join("")}</div>
      <form class="comment-box" data-action="comment-form"><input aria-label="Write a comment" placeholder="Write a comment…" maxlength="500" required><button type="submit">Send</button></form>
    </article>`).join("");
  }
  function renderProfile(){
    $("#mainContent").innerHTML=`<section class="card"><div class="profile-cover"></div><div class="profile-summary">${avatar(state.initial)}<button class="text-btn" style="float:right;margin-top:12px" id="editProfile">Edit profile</button><h2>${escapeHTML(state.name)}</h2><div class="muted">${escapeHTML(state.handle)}</div><p>${escapeHTML(state.bio)}</p><div class="profile-stats"><span><strong>${state.posts.filter(p=>p.handle===state.handle).length}</strong> Posts</span><span><strong>${state.friends.length}</strong> Friends</span></div></div></section><div class="feed-title"><h1>Your posts</h1></div><div id="profileFeed" class="feed"></div>`;
    $("#profileFeed").innerHTML=state.posts.filter(p=>p.handle===state.handle).length?state.posts.filter(p=>p.handle===state.handle).slice().reverse().map(p=>`<article class="post"><div class="post-header">${avatar(state.initial)}<div class="post-user"><strong>${escapeHTML(state.name)}</strong><small>${escapeHTML(p.time)}</small></div></div><p class="post-copy">${escapeHTML(p.text)}</p>${p.image?`<img class="post-image" src="${p.image}" alt="Your post photo">`:""}<div class="post-stats">💙 ${p.likes} likes · ${p.comments.length} comments</div></article>`).join(""):`<div class="empty-state"><strong>Your story starts here</strong>Publish your first post from the home feed.</div>`;
    $("#editProfile").addEventListener("click",editProfile);
  }
  function renderSimple(view){
    const pages={
      friends:`<h1>Friends</h1><p>Connect with people you know. Friend requests in this demo are stored only in your browser.</p>${state.friends.length?state.friends.map(n=>`<div class="friend-row">${avatar(n[0],"linear-gradient(145deg,#d7e5ff,#a4bfff)")}<div class="person-info"><strong>${escapeHTML(n)}</strong><small>Connected on NOVA</small></div><button data-remove-friend="${escapeHTML(n)}">Remove</button></div>`).join(""):`<div class="empty-state"><strong>Your circle is waiting</strong>Use “People you may know” on the home page to add demo friends.</div>`}`,
      messages:`<h1>Messages</h1><p>This visual demo does not send messages between real accounts yet.</p><div class="empty-state"><strong>Keep the conversation going</strong>To enable private chat, connect a backend and add user-to-user access rules before launch.</div>`,
      notifications:`<h1>Notifications</h1><p>You’ll see activity here as your community grows.</p><div class="empty-state"><strong>You’re all caught up</strong>Demo notifications will appear here when added.</div>`,
      saved:`<h1>Saved posts</h1><p>Posts you save are kept in this browser.</p><div id="feed" class="feed"></div>`
    };
    $("#mainContent").innerHTML=`<section class="simple-page">${pages[view]||pages.friends}</section>`;
    if(view==="saved")renderFeed($("#globalSearch").value);
    $$("[data-remove-friend]").forEach(b=>b.addEventListener("click",()=>{state.friends=state.friends.filter(n=>n!==b.dataset.removeFriend);persist();renderSimple("friends");toast("Friend removed.");}));
  }
  function showView(view){
    currentView=view;
    $$(".side-link, .icon-btn, .mobile-nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    $$(".side-link").forEach(b=>b.classList.toggle("selected",b.dataset.view===view));
    if(view==="feed"){ $("#mainContent").innerHTML=`<section class="stories card"><div class="section-heading"><h2>Stories</h2><span class="muted">Little moments</span></div><div class="story-row" id="storiesRow"><button class="story add-story" id="addStory"><span class="story-plus">＋</span><span>Add story</span></button><button class="story story-sample" data-story="Amina"><span class="story-avatar">A</span><span>Amina</span></button><button class="story story-sample story-two" data-story="David"><span class="story-avatar">D</span><span>David</span></button><button class="story story-sample story-three" data-story="Mira"><span class="story-avatar">M</span><span>Mira</span></button><button class="story story-sample story-four" data-story="Kevin"><span class="story-avatar">K</span><span>Kevin</span></button></div></section><section class="composer card"><div class="composer-top">${avatar(state.initial)}<button class="composer-prompt" id="focusPost">What’s on your mind?</button></div><textarea id="postText" rows="2" placeholder="Share something with your community…"></textarea><div class="composer-bottom"><label class="upload-label">▧ Photo <input id="photoInput" type="file" accept="image/*" hidden></label><span id="photoName" class="muted"></span><button class="primary-btn" id="publishPost">Publish post</button></div></section><div class="feed-title"><h1>News Feed</h1><button class="text-btn" id="sortPosts">${newestFirst?"Latest first ↓":"Oldest first ↑"}</button></div><div id="feed" class="feed"></div>`;bindComposer();renderFeed($("#globalSearch").value);}
    else if(view==="profile")renderProfile();else renderSimple(view);
  }
  function bindComposer(){
    $("#focusPost")?.addEventListener("click",()=>$("#postText").focus());
    $("#photoInput")?.addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith("image/")){toast("Please choose an image file.");return;}if(file.size>1200000){toast("Choose a photo under 1.2 MB for this browser demo.");e.target.value="";return;}const reader=new FileReader();reader.onload=()=>{selectedPhoto=reader.result;$("#photoName").textContent=file.name;};reader.readAsDataURL(file);});
    $("#publishPost")?.addEventListener("click",()=>{const text=$("#postText").value.trim();if(!text&&!selectedPhoto){toast("Write something or attach a photo first.");return;}state.posts.push({id:"p"+Date.now(),name:state.name,initial:state.initial,handle:state.handle,time:"Just now",text,likes:0,liked:false,comments:[],color:"linear-gradient(145deg,#ffcfad,#ff9f87)",image:selectedPhoto});persist();selectedPhoto="";$("#postText").value="";renderFeed($("#globalSearch").value);$("#photoName").textContent="";toast("Your post was published on this device.");});
    $("#sortPosts")?.addEventListener("click",()=>{newestFirst=!newestFirst;renderFeed($("#globalSearch").value);$("#sortPosts").textContent=newestFirst?"Latest first ↓":"Oldest first ↑";});
    $("#addStory")?.addEventListener("click",()=>toast("Stories are a demo preview; connect a backend to share them with others."));
    $$("[data-story]").forEach(b=>b.addEventListener("click",()=>openModal(`<h2>${escapeHTML(b.dataset.story)}’s story</h2><p>This is a sample story preview for the NOVA prototype.</p><button class="primary-btn" id="storyOk">Nice!</button>`)));
  }
  function editProfile(){openModal(`<h2>Edit your profile</h2><p>Update how you appear on NOVA.</p><label for="profileName">Display name</label><input id="profileName" maxlength="40" value="${escapeHTML(state.name)}"><label for="profileHandle">Username (include @)</label><input id="profileHandle" maxlength="25" value="${escapeHTML(state.handle)}"><label for="profileBio">Bio</label><textarea id="profileBio" maxlength="180">${escapeHTML(state.bio)}</textarea><button class="primary-btn" id="saveProfile">Save profile</button>`);$("#saveProfile").addEventListener("click",()=>{const name=$("#profileName").value.trim(),handle=$("#profileHandle").value.trim(),bio=$("#profileBio").value.trim();if(!name||!handle){toast("Name and username are required.");return;}state.name=name;state.handle=handle.startsWith("@")?handle:"@"+handle;state.initial=name[0].toUpperCase();state.bio=bio;persist();setProfileBits();$("#modal").close();showView("profile");toast("Profile updated on this device.");});}
  function openModal(html){$("#modalContent").innerHTML=html;$("#modal").showModal();$("#storyOk")?.addEventListener("click",()=>$("#modal").close());}
  $("#mainContent").addEventListener("click",e=>{
    const btn=e.target.closest("[data-action]");if(!btn)return;const postEl=btn.closest("[data-post]");if(!postEl)return;const post=state.posts.find(p=>p.id===postEl.dataset.post);if(!post)return;
    switch(btn.dataset.action){
      case "like":post.liked=!post.liked;post.likes=Math.max(0,post.likes+(post.liked?1:-1));persist();renderFeed($("#globalSearch").value);break;
      case "comment":postEl.querySelector(".comment-box input")?.focus();break;
      case "share":if(navigator.share){navigator.share({title:"NOVA post",text:post.text}).catch(()=>{});}else if(navigator.clipboard?.writeText){navigator.clipboard.writeText(post.text).then(()=>toast("Post text copied to clipboard.")).catch(()=>toast("Sharing is available from your device menu."));}else toast("Copy this post text to share it.");break;
      case "save":state.saved=state.saved.includes(post.id)?state.saved.filter(id=>id!==post.id):[...state.saved,post.id];persist();renderFeed($("#globalSearch").value);toast(state.saved.includes(post.id)?"Post saved.":"Post removed from saved.");break;
      case "more":openModal(`<h2>Post options</h2><p>You can save this post or copy its text to share it. Reporting and blocking should be added with a real backend before public launch.</p><button class="primary-btn" id="modalSave"> ${state.saved.includes(post.id)?"Unsave post":"Save post"}</button>`);$("#modalSave").addEventListener("click",()=>{state.saved=state.saved.includes(post.id)?state.saved.filter(id=>id!==post.id):[...state.saved,post.id];persist();$("#modal").close();renderFeed($("#globalSearch").value);});break;
    }
  });
  $("#mainContent").addEventListener("submit",e=>{if(!e.target.matches('[data-action="comment-form"]'))return;e.preventDefault();const post=state.posts.find(p=>p.id===e.target.closest("[data-post]").dataset.post);const input=$("input",e.target);if(input.value.trim()){post.comments.push({name:state.name,text:input.value.trim()});persist();renderFeed($("#globalSearch").value);toast("Comment added on this device.");}});
  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view]");if(nav){e.preventDefault();showView(nav.dataset.view);return;}
    const person=e.target.closest("[data-person]");if(person){const name=person.dataset.person;if(!state.friends.includes(name)){state.friends.push(name);persist();person.textContent="✓ Added";person.classList.add("following");toast(`${name} added to your demo friends.`);}else toast("Already added.");}
    const trend=e.target.closest("[data-search]");if(trend){showView("feed");$("#globalSearch").value=trend.dataset.search;renderFeed(trend.dataset.search);}
  });
  $("#globalSearch").addEventListener("input",()=>{if(currentView==="feed"||currentView==="saved")renderFeed($("#globalSearch").value);});
  $("#profileButton").addEventListener("click",()=>showView("profile"));
  $("#year").textContent=new Date().getFullYear();setProfileBits();bindComposer();renderFeed();
})();