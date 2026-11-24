"""Extrai o conteúdo das páginas HTML antigas para os arquivos JSON que o Tina edita.
Uso único, na migração para Next.js + Tina. Atenção: o Tina guarda campos rich-text
em JSON como texto Markdown; depois de rodar, converta os campos "root" para Markdown."""
import json, re
from html.parser import HTMLParser

def rich(html):
    """HTML simples (p, a, strong/b, em/i) -> AST de rich-text do Tina."""
    class P(HTMLParser):
        def __init__(s):
            super().__init__(); s.root = {"type": "root", "children": []}; s.stack = [s.root]; s.marks = set()
        def handle_starttag(s, tag, attrs):
            a = dict(attrs)
            if tag == "p":
                n = {"type": "p", "children": []}; s.stack[-1]["children"].append(n); s.stack.append(n)
            elif tag == "a":
                n = {"type": "a", "url": a.get("href", ""), "title": "", "children": []}
                s.stack[-1]["children"].append(n); s.stack.append(n)
            elif tag in ("strong", "b"): s.marks.add("bold")
            elif tag in ("em", "i"): s.marks.add("italic")
        def handle_endtag(s, tag):
            if tag in ("p", "a") and len(s.stack) > 1: s.stack.pop()
            elif tag in ("strong", "b"): s.marks.discard("bold")
            elif tag in ("em", "i"): s.marks.discard("italic")
        def handle_data(s, d):
            d = re.sub(r"\s+", " ", d)
            if not d.strip() and s.stack[-1] is s.root: return
            if s.stack[-1] is s.root:
                n = {"type": "p", "children": []}; s.root["children"].append(n); s.stack.append(n)
            t = {"type": "text", "text": d}
            for m in s.marks: t[m] = True
            s.stack[-1]["children"].append(t)
    p = P(); p.feed(html)
    for node in p.root["children"]:   # apara espaços nas pontas de cada parágrafo
        ch = node.get("children", [])
        if ch and ch[0].get("type") == "text": ch[0]["text"] = ch[0]["text"].lstrip()
        if ch and ch[-1].get("type") == "text": ch[-1]["text"] = ch[-1]["text"].rstrip()
    return p.root

def read(f): return open(f, encoding="utf-8").read()
def img(src): return "/" + src.lstrip("/")
def save(path, data):
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("ok", path)
def unvideo(src):
    m = re.search(r"/embed/([\w-]+)", src)
    if m: return f"https://www.youtube.com/watch?v={m.group(1)}"
    m = re.search(r"player\.vimeo\.com/video/(\d+)", src)
    if m: return f"https://vimeo.com/{m.group(1)}"
    return src

# ---------- home ----------
h = read("index.html")
save("content/home/home.json", {
    "tagline": re.search(r'<p class="tagline">(.*?)</p>', h).group(1),
    "capa": "/images/hero.webp",
})

# ---------- sobre ----------
s = read("sobre.html")
bio = re.search(r'<div class="bio">(.*?)</div>', s, re.S).group(1)
ret = re.search(r'<img class="retrato" src="([^"]+)" alt="([^"]*)"', s)
email = re.search(r'to=([^"&]+@[^"&]+)"', s).group(1)
insta = re.search(r'<a href="(https://www\.instagram\.com/[^"]+)"[^>]*>([^<]+)</a>', s)
save("content/sobre/sobre.json", {
    "bio": rich(bio), "retrato": img(ret.group(1)), "retratoAlt": ret.group(2),
    "email": email, "instagram": insta.group(1), "instagramTexto": insta.group(2),
})

# ---------- prints ----------
p = read("prints.html")
notas = re.findall(r"<li>(.*?)</li>", re.search(r'<section class="prints-notas">(.*?)</section>', p, re.S).group(1), re.S)
grid = re.search(r'<section class="prints">(.*?)</section>', p, re.S).group(1)
tokens = re.findall(r'<figure class="(w\d)"([^>]*)><img src="([^"]+)" alt="([^"]*)"|<div class="(w\d) dot"></div>', grid)
itens, linha, antes = [], 0, ""
for col, attrs, src, alt, dot in tokens:
    if dot:
        if linha == 0: antes = dot          # ponto no começo da linha: vai antes da próxima foto
        else: itens[-1]["ponto"] = "depois-" + dot[1]
        linha = (linha + int(dot[1])) % 8; continue
    d = dict(re.findall(r'data-([a-z]+)="([^"]*)"', attrs))
    item = {"imagem": img(src), "alt": alt, "coluna": col, "ponto": ("antes-" + antes[1]) if antes else "nenhum",
            "tipo": d.get("tipo", "nenhum"), "titulo": d.get("titulo", ""), "tamanho": d.get("tamanho", "a4"),
            "fineArt": int(d.get("sem", 200)), "fineArtComMoldura": int(d.get("com", 440)), "nota": d.get("nota", "")}
    antes = ""; itens.append(item); linha = (linha + int(col[1])) % 8
save("content/prints/prints.json", {"notas": rich("".join(f"<p>{n}</p>" for n in notas)), "fotos": itens})

# ---------- portfolio ----------
areas = [("filmes", "portfolio.html", "filmes"), ("fotografia", "portfolio-fotografia.html", "fotografia"),
         ("filmmaker", "portfolio-filmmaker.html", "filmmaker"), ("logger", "portfolio-logger.html", "logger e assistente de edição"),
         ("exposicoes", "portfolio-exposicoes.html", "exposições"), ("publicacoes", "portfolio-publicacoes.html", "publicações"),
         ("feiras", "portfolio-feiras.html", "feiras")]
arranjos = {"pf-gallery-retratos": "retratos", "pf-gallery-familia": "familia", "pf-gallery-jornadas": "jornadas",
            "pf-gallery-feiras": "feiras", "pf-gallery-destaque": "destaque", "pf-gallery-2": "colunas"}
def fotos(gal):
    out = []
    for m in re.finditer(r'<figure>\s*<img src="([^"]+)" alt="([^"]*)"[^>]*>(?:<figcaption>(.*?)</figcaption>)?\s*</figure>', gal, re.S):
        out.append({"imagem": img(m.group(1)), "alt": m.group(2), "legenda": (m.group(3) or "").strip()})
    return out
def galerias(html):
    blocos = []
    for m in re.finditer(r'<div class="pf-gallery([^"]*)">(.*?)\n        </div>', html, re.S):
        cls = m.group(1).strip(); arr = arranjos.get(cls, "colunas")
        leg = re.search(r'<p class="pf-caption[^"]*">(.*?)</p>', m.group(2))
        blocos.append({"_template": "galeria", "titulo": "", "ancora": "", "arranjo": arr,
                       "fotos": fotos(m.group(2)), "legenda": leg.group(1) if leg else ""})
    return blocos
for ordem, (slug, arquivo, menu) in enumerate(areas, 1):
    h = read(arquivo)
    sec = re.search(r'<section class="pf-section" id="\w+">(.*?)\n      <nav class="pf-pager"', h, re.S).group(1)
    titulo = re.search(r"<h2>(.*?)</h2>", sec).group(1)
    blocos = []
    if slug == "filmes":
        itens = []
        for a in re.findall(r'<article class="pf-film pf-film-video">(.*?)</article>', sec, re.S):
            t = re.search(r"<h3>(.*?) <span class=\"pf-year\">\((\d+)\)</span></h3>", a)
            ps = "".join(re.findall(r"<p>.*?</p>", a, re.S))
            itens.append({"titulo": t.group(1), "ano": t.group(2), "descricao": rich(ps),
                          "video": unvideo(re.search(r'<iframe src="([^"]+)"', a).group(1))})
        blocos.append({"_template": "filmes", "itens": itens})
    elif slug == "publicacoes":
        itens = []
        for a in re.findall(r'<article class="pf-film">(.*?)</article>', sec, re.S):
            im = re.search(r'<img src="([^"]+)" alt="([^"]*)"', a); w = re.search(r'<a class="pf-watch" href="([^"]+)"[^>]*>(.*?)</a>', a)
            itens.append({"titulo": re.search(r"<h3>(.*?)</h3>", a).group(1), "capa": img(im.group(1)), "capaAlt": im.group(2),
                          "descricao": rich("".join(re.findall(r"<p>.*?</p>", a, re.S))), "link": w.group(1), "linkTexto": w.group(2)})
        blocos.append({"_template": "livros", "itens": itens})
    else:
        texto = re.search(r'<div class="pf-text">(.*?)</div>', sec, re.S)
        if texto: blocos.append({"_template": "texto", "corpo": rich(texto.group(1))})
        if slug == "fotografia":
            for sub in re.finditer(r'<section class="pf-sub" id="(\w+)">\s*<h3>(.*?)</h3>(.*?)</section>', sec, re.S):
                g = galerias(sub.group(3) + "\n        </div>")[0] if False else None
                gm = re.search(r'<div class="pf-gallery([^"]*)">(.*)</div>', sub.group(3), re.S)
                cls = gm.group(1).strip()
                blocos.append({"_template": "galeria", "titulo": sub.group(2), "ancora": sub.group(1),
                               "arranjo": arranjos.get(cls, "colunas"), "fotos": fotos(gm.group(2)), "legenda": ""})
        else:
            blocos += galerias(sec)
    save(f"content/portfolio/{slug}.json", {"titulo": titulo, "menu": menu, "ordem": ordem, "blocos": blocos})
