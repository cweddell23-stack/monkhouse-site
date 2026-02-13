(function(){
  const $ = (sel, el=document) => el.querySelector(sel);

  // Active nav highlighting
  const path = location.pathname.replace(/\/+$/, "");
  document.querySelectorAll(".nav a").forEach(a=>{
    const href = a.getAttribute("href");
    if(!href) return;
    // Match root and folder index
    const normalized = href.replace(/\/+$/, "");
    if(normalized === "/" && (path === "" || path === "/")) a.classList.add("active");
    else if(normalized !== "/" && path.startsWith(normalized.replace(/index\.html$/,""))) a.classList.add("active");
  });

  // Notice board loader
  const noticeEl = $("#notice");
  if(noticeEl){
    fetch("/data/notice.json", {cache:"no-store"})
      .then(r=>r.json())
      .then(data=>{
        const title = data.title || "Notice";
        const date = data.date || "";
        const time = data.time || "";
        const ref = data.reference || "";
        const body = Array.isArray(data.body) ? data.body : [String(data.body||"")];

        const stamp = [date, time].filter(Boolean).join(" • ");
        noticeEl.innerHTML = `
          <div class="notice-head">
            <div>
              <span class="kicker">MONKHOUSE NOTICE BOARD</span>
              <h2>${escapeHtml(title)}</h2>
            </div>
            <div class="stamp">
              <b>${escapeHtml(ref || "Public")}</b>
              <span>${escapeHtml(stamp || "")}</span>
            </div>
          </div>
          <div class="hr"></div>
          <div class="notice-body">
            ${body.filter(Boolean).map(p=>`<p>${escapeHtml(p)}</p>`).join("")}
          </div>
          <div class="divider"></div>
          <small>Updated automatically from <code>/data/notice.json</code>. Customers never interact with AI directly.</small>
        `;
      })
      .catch(()=>{
        noticeEl.innerHTML = `
          <span class="kicker">MONKHOUSE NOTICE BOARD</span>
          <h2>Notice unavailable</h2>
          <p class="muted">The board couldn’t load right now. (This usually means the <code>data/notice.json</code> file is missing.)</p>
        `;
      });
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
})();
