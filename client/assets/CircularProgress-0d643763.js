import{g as N,h as U,an as D,s as v,a1 as n,_ as o,ao as _,e as j,n as z,o as I,j as p,w as E,x as F}from"./index-70f36f4d.js";function K(r){return U("MuiCircularProgress",r)}const W=N("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]),J=W,B=["className","color","disableShrink","size","style","thickness","value","variant"];let l=r=>r,P,S,$,b;const a=44,G=D(P||(P=l`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),L=D(S||(S=l`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),T=r=>{const{classes:e,variant:s,color:t,disableShrink:d}=r,u={root:["root",s,`color${n(t)}`],svg:["svg"],circle:["circle",`circle${n(s)}`,d&&"circleDisableShrink"]};return F(u,K,e)},V=v("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.root,e[s.variant],e[`color${n(s.color)}`]]}})(({ownerState:r,theme:e})=>o({display:"inline-block"},r.variant==="determinate"&&{transition:e.transitions.create("transform")},r.color!=="inherit"&&{color:(e.vars||e).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&_($||($=l`
      animation: ${0} 1.4s linear infinite;
    `),G)),Z=v("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,e)=>e.svg})({display:"block"}),q=v("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.circle,e[`circle${n(s.variant)}`],s.disableShrink&&e.circleDisableShrink]}})(({ownerState:r,theme:e})=>o({stroke:"currentColor"},r.variant==="determinate"&&{transition:e.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&_(b||(b=l`
      animation: ${0} 1.4s ease-in-out infinite;
    `),L)),A=j.forwardRef(function(e,s){const t=z({props:e,name:"MuiCircularProgress"}),{className:d,color:u="primary",disableShrink:M=!1,size:m=40,style:w,thickness:i=3.6,value:h=0,variant:k="indeterminate"}=t,R=I(t,B),c=o({},t,{color:u,disableShrink:M,size:m,thickness:i,value:h,variant:k}),f=T(c),g={},C={},x={};if(k==="determinate"){const y=2*Math.PI*((a-i)/2);g.strokeDasharray=y.toFixed(3),x["aria-valuenow"]=Math.round(h),g.strokeDashoffset=`${((100-h)/100*y).toFixed(3)}px`,C.transform="rotate(-90deg)"}return p(V,o({className:E(f.root,d),style:o({width:m,height:m},C,w),ownerState:c,ref:s,role:"progressbar"},x,R,{children:p(Z,{className:f.svg,ownerState:c,viewBox:`${a/2} ${a/2} ${a} ${a}`,children:p(q,{className:f.circle,style:g,ownerState:c,cx:a,cy:a,r:(a-i)/2,fill:"none",strokeWidth:i})})}))}),O=A;export{O as C,J as c};
