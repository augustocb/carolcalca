(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{932:(e,t,a)=>{"use strict";a.d(t,{Dr:()=>o,Iy:()=>i,LY:()=>n});let n=e=>e?e.startsWith("/")?"/carolcalca/teste-tina"+e:e:"",i=e=>"filmes"===e?"portfolio":"portfolio-".concat(e);function o(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=e.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);if(t)return"https://www.youtube-nocookie.com/embed/".concat(t[1]);let a=e.match(/vimeo\.com\/(?:video\/)?(\d+)/);return a?"https://player.vimeo.com/video/".concat(a[1],"?dnt=1"):e}},3301:(e,t,a)=>{"use strict";a.d(t,{HH:()=>s,iX:()=>d});let n=new Set(["__typename","_sys","_internalSys","_values","_internalValues","_content_source","_tina_metadata"]),i=(e,t,a=[])=>{if(null===t||function(e){let t=typeof e;return"string"===t||"number"===t||"boolean"===t||"undefined"===t||null==e||e instanceof String||e instanceof Number||e instanceof Boolean||!1}(t))return t;if(t instanceof String)return t.valueOf();if(Array.isArray(t))return t.map((t,n)=>i(e,t,[...a,n]));let o={};for(let[r,s]of Object.entries(t))n.has(r)?o[r]=s:o[r]=i(e,s,[...a,r]);return o&&"type"in o&&"root"===o.type?o:{...o,_content_source:{queryId:e,path:a}}},o=`
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
`;var r=a(2115);let s=(e,t,a)=>{let n=null==e?void 0:e._content_source;if(!n)return"";let{queryId:i,path:o}=n;if(!t)return`${i}---${o.join(".")}`;let r="number"==typeof a?[...o,t,a]:[...o,t];return`${i}---${r.join(".")}`},l=r.createContext(null);function d(e){let t=JSON.stringify({query:e.query,variables:e.variables}),a=r.useMemo(()=>(e=>{let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a)|0;return Math.abs(t).toString(36)})(t),[t]),n=r.useMemo(()=>{if(e.data)return i(a,JSON.parse(JSON.stringify(e.data)),[])},[e.data,a]),s=function(){let e=r.useContext(l);return r.useMemo(()=>null==e?"undefined"!=typeof window?[window.location.origin]:[]:Array.isArray(e)?[...e]:[e],[e])}(),[d,c]=r.useState(n),[u,p]=r.useState(!1),[f,h]=r.useState(!1),[m,y]=r.useState(!1);return r.useEffect(()=>{p(!0),c(n),parent.postMessage({type:"url-changed"})},[a,n]),r.useEffect(()=>{if(f){let e=function(e){let t,a=e.target.getAttributeNames().find(e=>e.startsWith("data-tina-field"));if(a)e.preventDefault(),e.stopPropagation(),t=e.target.getAttribute(a);else{let a=e.target.closest("[data-tina-field], [data-tina-field-overlay]");if(a){let n=a.getAttributeNames().find(e=>e.startsWith("data-tina-field"));n&&(e.preventDefault(),e.stopPropagation(),t=a.getAttribute(n))}}t&&m&&parent.postMessage({type:"field:selected",fieldName:t},window.location.origin)},t=document.createElement("style");return t.type="text/css",t.textContent=o,document.head.appendChild(t),document.body.classList.add("__tina-quick-editing-enabled"),document.addEventListener("click",e,!0),()=>{document.removeEventListener("click",e,!0),document.body.classList.remove("__tina-quick-editing-enabled"),t.remove()}}},[f,m]),r.useEffect(()=>{(null==e?void 0:e.experimental___selectFormByFormId)&&parent.postMessage({type:"user-select-form",formId:e.experimental___selectFormByFormId()})},[a]),r.useEffect(()=>{let{experimental___selectFormByFormId:t,...n}=e;parent.postMessage({type:"open",...n,id:a},window.location.origin);let o=e=>{"undefined"!=typeof window&&s.includes(e.origin)&&e.source===window.parent&&("quickEditEnabled"===e.data.type&&h(e.data.value),e.data.id===a&&"updateData"===e.data.type&&(c(i(a,JSON.parse(JSON.stringify(e.data.data)),[])),y(!0),document.querySelector("[data-tina-field]")?parent.postMessage({type:"quick-edit",value:!0},window.location.origin):parent.postMessage({type:"quick-edit",value:!1},window.location.origin)))};return window.addEventListener("message",o),()=>{window.removeEventListener("message",o),parent.postMessage({type:"close",id:a},window.location.origin)}},[a,h,s]),{data:d,isClient:u}}},3339:(e,t,a)=>{Promise.resolve().then(a.bind(a,3360))},3360:(e,t,a)=>{"use strict";a.d(t,{default:()=>r});var n=a(5155),i=a(3301),o=a(932);function r(e){let{data:t}=(0,i.iX)(e),a=t.home;return(0,n.jsxs)("div",{className:"home",style:{"--capa":'url("'.concat((0,o.LY)(a.capa),'")')},"data-tina-field":(0,i.HH)(a,"capa"),children:[(0,n.jsxs)("h1",{className:"logo",children:["Carol",(0,n.jsx)("b",{children:"Calcavecchia"})]}),(0,n.jsx)("p",{className:"tagline","data-tina-field":(0,i.HH)(a,"tagline"),children:a.tagline}),(0,n.jsx)("nav",{children:(0,n.jsxs)("ul",{className:"menu",children:[(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"portfolio",children:"portfolio"})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"prints",children:"prints"})}),(0,n.jsx)("li",{children:(0,n.jsx)("a",{href:"sobre",children:"sobre"})})]})})]})}}},e=>{e.O(0,[441,255,358],()=>e(e.s=3339)),_N_E=e.O()}]);