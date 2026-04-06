#!/usr/bin/env python3
import json, re, datetime
from pathlib import Path

TAG_COLORS = {
    "生涯輾導": ("E3F2FD","1565C0","linear-gradient(135deg,#1565C0,#42A5F5)"),
    "人物研究": ("E8F4FD","1E6B9A","linear-gradient(135deg,#1E3A5F,#2E6DA4)"),
    "K-pop":    ("FCE4EC","AD1457","linear-gradient(135deg,#AD1457,#E91E8C)"),
    "科技":     ("E8F5E9","2E7D32","linear-gradient(135deg,#1B5E20,#43A047)"),
    "旅遊":     ("FFF8E1","F57F17","linear-gradient(135deg,#E65100,#FFA726)"),
    "IP分析":   ("F3E5F5","6A1B9A","linear-gradient(135deg,#4A148C,#9C27B0)"),
    "趣味":     ("E8EAF6","283593","linear-gradient(135deg,#1A237E,#3F51B5)"),
    "文化觀察": ("FBE9E7","BF360C","linear-gradient(135deg,#BF360C,#FF5722)"),
    "部落格":   ("F0E6DB","5C4A3A","linear-gradient(135deg,#C8602A,#8B3A14)"),
}

def make_card(p, extra_class="sortable"):
    tag = p["tag"]
    bg, fg, thumb_bg = TAG_COLORS.get(tag, ("F5F5F5","333333","linear-gradient(135deg,#999,#555)"))
    site_id = p.get("site_id","")
    views = ""
    if site_id:
        views = "<span class=\"card-views\"><span class=\"site-count\" data-site=\""+site_id+"\">—</span></span>"
    return (
        "  <a href=""+p["url"]+"" target=\"_blank\" class=\"project-card "+extra_class+"\" data-tag=""+tag+"" data-site=""+site_id+"">
"
        +"    <div class=\"card-thumb\" style=\"background:"+thumb_bg+"\" aria-hidden=\"true\">"+p["emoji"]+"</div>
"
        +"    <div class=\"card-body\">
"
        +"      <h3>"+p["title"]+"</h3>
"
        +"      <p>"+p["desc"]+"</p>
"
        +"      <div class=\"card-meta\">
"
        +"        <span class=\"card-tag\" style=\"background:#"+bg+";color:#"+fg+";\">" +tag+"</span>
"
        +"        "+views+"
"
        +"      </div>
"
        +"    </div>
"
        +"  </a>"
    )

def build():
    projects = json.loads(Path("projects.json").read_text(encoding="utf-8"))
    normal = [p for p in projects if not p.get("pinned")]
    pinned = [p for p in projects if p.get("pinned")]
    parts = [make_card(p) for p in normal]
    for p in pinned:
        parts.append(make_card(p, "pinned-last"))
    cards_html = "

".join(parts)
    today = datetime.date.today().isoformat()
    index = Path("index.html").read_text(encoding="utf-8")
    index = re.sub(
        r'(<section class="grid" id="projectGrid">).*?(</section>)',
        "

" + cards_html + "

",
        index, flags=re.DOTALL
    )
    index = re.sub(r'最後更新：[\d\-年月 ]+', f'最後更新：{today}', index)
    Path("index.html").write_text(index, encoding="utf-8")
    print(f"Built {len(projects)} cards. Date: {today}")

if __name__ == "__main__":
    build()
