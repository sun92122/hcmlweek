import{u as y}from"./asyncData.ClsJB6xx.js";import{u as h}from"./index.De001Tdn.js";import{_ as v}from"./nuxt-img.DtERgwcm.js";import{g as P,_ as f,o,c as s,a as t,b as N,t as c,k as i,l as $,F as k,r as T,h as b,j as B,w as I,d as w}from"./entry.QVgBm2iM.js";const C=P({name:"productBox",props:{ProductImage:{type:String,required:!1},ProductName:{type:[String,Number],required:!1},ProductNoted:{type:String,required:!1},Price:{type:Object,required:!1}},methods:{redirectToProduct(){h().goToProduct(`${this.ProductName}`),this.$router.push(`/product/${this.ProductName}`)}}}),S={class:"product-img"},q={class:"product-info"},L={class:"product-name"},V={class:"product-noted"},j=["innerHTML"],H={class:"product-price"},A={key:0},D={key:0},F={key:1},M={key:2};function O(e,r,u,n,p,l){const a=v;return o(),s("div",{class:"product-box",onClick:r[0]||(r[0]=(...d)=>e.redirectToProduct&&e.redirectToProduct(...d))},[t("div",S,[N(a,{src:e.ProductImage?e.ProductImage:"https://via.placeholder.com/150",alt:"product"},null,8,["src"])]),t("div",q,[t("div",L,[t("span",null,c(e.ProductName),1)]),t("div",V,[t("span",{innerHTML:e.ProductNoted},null,8,j)]),t("div",H,[e.Price?(o(),s("span",A,[t("span",null,"NT $"+c(e.Price.min),1),e.Price.max>e.Price.min?(o(),s("span",D,"-")):i("",!0),e.Price.max>e.Price.min?(o(),s("span",F,"NT $"+c(e.Price.max),1)):i("",!0),e.Price.ori?(o(),s("del",M,"NT $"+c(e.Price.ori),1)):i("",!0)])):i("",!0)])])])}const g=f(C,[["render",O],["__scopeId","data-v-7d038c4a"]]),x={class:"product-container"},E={name:"Home",layout:"default",data(){return{productBox:g}}},R=P({...E,async setup(e){let r,u;const n=h();let p=n.getProducts;if(Object.keys(p).length===0){var l={};[r,u]=$(async()=>y("productsData",()=>$fetch(n.apiURL).then(async d=>{l=await d}))),r=await r,u();const a=l;n.products=a}else console.log("no need to fetch");return(a,d)=>(o(),s("div",null,[t("div",x,[t("div",null,[(o(!0),s(k,null,T(b(p),(m,_)=>(o(),B(g,{"-product-image":m.image,"-product-name":_,"-product-noted":m.noted,"-price":m.price,key:_},{default:I(()=>[w(c(_),1)]),_:2},1032,["-product-image","-product-name","-product-noted","-price"]))),128))])])]))}}),K=f(R,[["__scopeId","data-v-438462cb"]]);export{K as default};