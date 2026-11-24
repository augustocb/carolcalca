(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{932:(e,t,a)=>{"use strict";a.d(t,{Dr:()=>r,Iy:()=>n,LY:()=>i});let i=e=>e?e.startsWith("/")?""+e:e:"",n=e=>"filmes"===e?"portfolio":"portfolio-".concat(e);function r(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=e.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);if(t)return"https://www.youtube-nocookie.com/embed/".concat(t[1]);let a=e.match(/vimeo\.com\/(?:video\/)?(\d+)/);return a?"https://player.vimeo.com/video/".concat(a[1],"?dnt=1"):e}},3301:(e,t,a)=>{"use strict";a.d(t,{HH:()=>s,iX:()=>d});let i=new Set(["__typename","_sys","_internalSys","_values","_internalValues","_content_source","_tina_metadata"]),n=(e,t,a=[])=>{if(null===t||function(e){let t=typeof e;return"string"===t||"number"===t||"boolean"===t||"undefined"===t||null==e||e instanceof String||e instanceof Number||e instanceof Boolean||!1}(t))return t;if(t instanceof String)return t.valueOf();if(Array.isArray(t))return t.map((t,i)=>n(e,t,[...a,i]));let r={};for(let[o,s]of Object.entries(t))i.has(o)?r[o]=s:r[o]=n(e,s,[...a,o]);return r&&"type"in r&&"root"===r.type?r:{...r,_content_source:{queryId:e,path:a}}},r=`
  [data-tina-field] {
    outline: 2px dashed rgba(34,150,254,0.5);
    transition: box-shadow ease-out 150ms;
  }
  [data-tina-field]:hover {
    outline: 2px solid rgba(34,150,254,1);
    cursor: pointer;
  }
  [data-tina-field-overlay] {
    outline: 2px dashed rgba(34,150,254,0.5);
    position: relative;
  }
  [data-tina-field-overlay]:hover {
    outline: 2px solid rgba(34,150,254,1);
    cursor: pointer;
  }
  [data-tina-field-overlay]::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 20;
    transition: opacity ease-out 150ms;
    background-color: rgba(34,150,254,0.3);
    opacity: 0;
  }
  /*
   * Only the blue fill/wash is gated to hover-capable pointers. On touch
   * screens (hover: none) :hover latches after a tap and never clears; a
   * stuck solid outline is acceptable tap feedback, but the full-bleed wash
   * flooding the tapped element is not. The solid outline above still applies
   * on touch; only the box-shadow wash and the overlay reveal are held back.
   */
  @media (hover: hover) {
    [data-tina-field]:hover {
      box-shadow: inset 100vi 100vh rgba(34,150,254,0.3);
    }
    [data-tina-field-overlay]:hover::after {
      opacity: 1;
    }
  }
`;var o=a(2115);let s=(e,t,a)=>{let i=null==e?void 0:e._content_source;if(!i)return"";let{queryId:n,path:r}=i;if(!t)return`${n}---${r.join(".")}`;let o="number"==typeof a?[...r,t,a]:[...r,t];return`${n}---${o.join(".")}`},l=o.createContext(null);function d(e){let t=JSON.stringify({query:e.query,variables:e.variables}),a=o.useMemo(()=>(e=>{let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a)|0;return Math.abs(t).toString(36)})(t),[t]),i=o.useMemo(()=>{if(e.data)return n(a,JSON.parse(JSON.stringify(e.data)),[])},[e.data,a]),s=function(){let e=o.useContext(l);return o.useMemo(()=>null==e?"undefined"!=typeof window?[window.location.origin]:[]:Array.isArray(e)?[...e]:[e],[e])}(),[d,c]=o.useState(i),[u,p]=o.useState(!1),[f,h]=o.useState(!1),[g,v]=o.useState(!1);return o.useEffect(()=>{p(!0),c(i),parent.postMessage({type:"url-changed"})},[a,i]),o.useEffect(()=>{if(f){let e=function(e){let t,a=e.target.getAttributeNames().find(e=>e.startsWith("data-tina-field"));if(a)e.preventDefault(),e.stopPropagation(),t=e.target.getAttribute(a);else{let a=e.target.closest("[data-tina-field], [data-tina-field-overlay]");if(a){let i=a.getAttributeNames().find(e=>e.startsWith("data-tina-field"));i&&(e.preventDefault(),e.stopPropagation(),t=a.getAttribute(i))}}t&&g&&parent.postMessage({type:"field:selected",fieldName:t},window.location.origin)},t=document.createElement("style");return t.type="text/css",t.textContent=r,document.head.appendChild(t),document.body.classList.add("__tina-quick-editing-enabled"),document.addEventListener("click",e,!0),()=>{document.removeEventListener("click",e,!0),document.body.classList.remove("__tina-quick-editing-enabled"),t.remove()}}},[f,g]),o.useEffect(()=>{(null==e?void 0:e.experimental___selectFormByFormId)&&parent.postMessage({type:"user-select-form",formId:e.experimental___selectFormByFormId()})},[a]),o.useEffect(()=>{let{experimental___selectFormByFormId:t,...i}=e;parent.postMessage({type:"open",...i,id:a},window.location.origin);let r=e=>{"undefined"!=typeof window&&s.includes(e.origin)&&e.source===window.parent&&("quickEditEnabled"===e.data.type&&h(e.data.value),e.data.id===a&&"updateData"===e.data.type&&(c(n(a,JSON.parse(JSON.stringify(e.data.data)),[])),v(!0),document.querySelector("[data-tina-field]")?parent.postMessage({type:"quick-edit",value:!0},window.location.origin):parent.postMessage({type:"quick-edit",value:!1},window.location.origin)))};return window.addEventListener("message",r),()=>{window.removeEventListener("message",r),parent.postMessage({type:"close",id:a},window.location.origin)}},[a,h,s]),{data:d,isClient:u}}},3339:(e,t,a)=>{Promise.resolve().then(a.bind(a,8847))},8847:(e,t,a)=>{"use strict";a.d(t,{default:()=>s});var i=a(5155),n=a(3301);let r=JSON.parse('{"fonte":"/images/hero.webp","versoes":[{"src":"/images/capa/capa-800.webp","largura":800},{"src":"/images/capa/capa-1200.webp","largura":1200},{"src":"/images/capa/capa-1600.webp","largura":1600}],"previa":"data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASogABUAPu1sqk6ppqOiMBgIATAdiWkAAHB3UV8EWHIPG4WPLAAA/oY5o77EKwePv1nZON/ILqq9MMVXMDsegdaHGg1MCXRGunko5+soR/6XL1AY2HP///s4t7Rn1Y33DZ2WE0SAAAA="}');var o=a(932);function s(e){let{data:t}=(0,n.iX)(e),a=t.home,s=function(e){var t,a;let i=null==(t=r.fonte)?void 0:t.replace(/^\/images/,"");if(!(i&&(e===r.fonte||e.endsWith(i)))||!(null==(a=r.versoes)?void 0:a.length))return{src:(0,o.LY)(e)};let n=r.versoes[r.versoes.length-1],s=r.versoes.find(e=>e.largura>=1200)||n;return{src:(0,o.LY)(s.src),srcSet:r.versoes.map(e=>"".concat((0,o.LY)(e.src)," ").concat(e.largura,"w")).join(", "),previa:r.previa}}(a.capa);return(0,i.jsxs)("div",{className:"home",style:s.previa?{"--capa-previa":'url("'.concat(s.previa,'")')}:void 0,children:[(0,i.jsx)("img",{className:"home-capa",src:s.src,srcSet:s.srcSet,sizes:"100vw",alt:"",fetchPriority:"high",decoding:"async","data-tina-field":(0,n.HH)(a,"capa")}),(0,i.jsxs)("h1",{className:"logo",children:["Carol",(0,i.jsx)("b",{children:"Calcavecchia"})]}),(0,i.jsx)("p",{className:"tagline","data-tina-field":(0,n.HH)(a,"tagline"),children:a.tagline}),(0,i.jsx)("nav",{children:(0,i.jsxs)("ul",{className:"menu",children:[(0,i.jsx)("li",{children:(0,i.jsx)("a",{href:"portfolio",children:"portfolio"})}),(0,i.jsx)("li",{children:(0,i.jsx)("a",{href:"prints",children:"prints"})}),(0,i.jsx)("li",{children:(0,i.jsx)("a",{href:"sobre",children:"sobre"})})]})})]})}}},e=>{e.O(0,[441,255,358],()=>e(e.s=3339)),_N_E=e.O()}]);