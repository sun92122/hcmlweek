import{u as f}from"./index.De001Tdn.js";import{_ as I}from"./nuxt-img.DtERgwcm.js";import{g as v,c,a as t,b as p,w as h,F as g,r as k,e as S,o as s,t as r,h as i,p as b,f as N,i as B,_ as $,j}from"./entry.QVgBm2iM.js";const y=e=>(b("data-v-3cefbede"),e=e(),N(),e),w={class:"cart-box"},x={class:"product-img"},F={class:"product-container"},q={class:"product-name"},O=y(()=>t("div",{class:"product-info"},[t("div",{class:"product-option"},[t("span")]),t("div",{class:"product-count"},[t("span",null,"數量")]),t("div",{class:"product-subtotal"},[t("span",null,"小計")])],-1)),z={class:"product-info"},L={key:0},V={class:"product-option"},D={class:"product-count"},E={class:"product-subtotal"},P={class:"product-remove"},T={key:1},U=y(()=>t("div",{class:"product-option"},[t("span")],-1)),A={class:"product-count"},G={class:"product-subtotal"},H={class:"product-remove"},J=v({name:"cartBox",props:{productName:{type:String,required:!0},product:{type:Object,required:!0},item:{type:Object,required:!0}}}),K=v({...J,setup(e){const a=f();return(o,u)=>{const l=I,_=S,m=B;return s(),c("div",w,[t("div",x,[p(_,{to:`/product/${o.productName}`},{default:h(()=>[p(l,{src:o.product.image?o.product.image:"https://via.placeholder.com/150",alt:"product",height:"100px",fit:"outside"},null,8,["src"])]),_:1},8,["to"])]),t("div",F,[t("div",q,[p(_,{to:`/product/${o.productName}`},{default:h(()=>[t("span",null,r(o.productName),1)]),_:1},8,["to"])]),O,(s(!0),c(g,null,k(o.item,(d,n)=>(s(),c("div",z,[o.product.options[n]?(s(),c("div",L,[t("div",V,[t("span",null,r(o.product.options[n].name),1)]),t("div",D,[t("span",null,r(d),1)]),t("div",E,[t("span",null,r(d*(o.product.options[n].price||o.product.price.min)),1)]),t("div",P,[p(m,{size:"2xs",variant:"outline",color:"red",label:"移除",onClick:()=>i(a).removeFromCart(o.productName,parseInt(n))},null,8,["onClick"])])])):(s(),c("div",T,[U,t("div",A,[t("span",null,r(d),1)]),t("div",G,[t("span",null,r(d*o.product.price.min),1)]),t("div",H,[p(m,{size:"2xs",variant:"outline",color:"red",label:"移除",onClick:u[0]||(u[0]=()=>i(a).removeFromCart(o.productName,-1))})])]))]))),256))])])}}}),C=$(K,[["__scopeId","data-v-3cefbede"]]),M=e=>(b("data-v-33e8113f"),e=e(),N(),e),Q={class:"cart-container"},R={key:0},W=M(()=>t("h2",null,"購物車是空的",-1)),X=[W],Y={key:1},Z={class:"cart-total"},tt={name:"Cart",layout:"default",data(){return{cartBox:C}}},ot=v({...tt,setup(e){const a=f(),o=a.getProducts,u=a.cart,l=a.getTotal;return(_,m)=>(s(),c("div",null,[t("div",Q,[Object.keys(i(u)).length?(s(),c("div",Y,[(s(!0),c(g,null,k(i(u),(d,n)=>(s(),j(C,{key:n,productName:String(n),product:i(o)[n],item:d},null,8,["productName","product","item"]))),128))])):(s(),c("div",R,X)),t("div",Z,[t("span",null,"總金額: "+r(i(l)),1)])])]))}}),nt=$(ot,[["__scopeId","data-v-33e8113f"]]);export{nt as default};