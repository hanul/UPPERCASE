window.ActiveXObject&&!window.CanvasRenderingContext2D&&function(i,j,z){function D(t){this.code=t,this.message=R[t]}function S(t){this.width=t}function v(t){this.id=t.C++}function k(t){this.G=t,this.id=t.C++}function m(t,i){this.canvas=t,this.B=i,this.d=i.id.slice(8),this.D(),this.C=0,this.f=this.u="";var e=this;setInterval(function(){0===o[e.d]&&e.e()},30)}function A(){if("complete"===j.readyState){j.detachEvent(E,A);for(var t=j.getElementsByTagName(r),i=0,e=t.length;e>i;++i)B.initElement(t[i])}}function F(){var t=event.srcElement,i=t.parentNode;t.blur(),i.focus()}function G(){var t=event.propertyName;if("width"===t||"height"===t){var i=event.srcElement,e=i[t],s=parseInt(e,10);(isNaN(s)||0>s)&&(s="width"===t?300:150),e===s?(i.style[t]=s+"px",i.getContext("2d").I(i.width,i.height)):i[t]=s}}function H(){i.detachEvent(I,H);for(var t in s){var e,h=s[t],n=h.firstChild;for(e in n)"function"==typeof n[e]&&(n[e]=l);for(e in h)"function"==typeof h[e]&&(h[e]=l);n.detachEvent(J,F),h.detachEvent(K,G)}i[L]=l,i[M]=l,i[N]=l,i[C]=l,i[O]=l}function T(){var t=j.getElementsByTagName("script"),t=t[t.length-1];return j.documentMode>=8?t.src:t.getAttribute("src",4)}function t(t){return(""+t).replace(/&/g,"&amp;").replace(/</g,"&lt;")}function U(t){return t.toLowerCase()}function h(t){throw new D(t)}function P(t){var i=parseInt(t.width,10),e=parseInt(t.height,10);(isNaN(i)||0>i)&&(i=300),(isNaN(e)||0>e)&&(e=150),t.width=i,t.height=e}var l=null,r="canvas",L="CanvasRenderingContext2D",M="CanvasGradient",N="CanvasPattern",C="FlashCanvas",O="G_vmlCanvasManager",J="onfocus",K="onpropertychange",E="onreadystatechange",I="onunload",w=((i[C+"Options"]||{}).swfPath||T().replace(/[^\/]+$/,""))+"flashcanvas.swf",e=new function(t){for(var i=0,e=t.length;e>i;i++)this[t[i]]=i}("toDataURL,save,restore,scale,rotate,translate,transform,setTransform,globalAlpha,globalCompositeOperation,strokeStyle,fillStyle,createLinearGradient,createRadialGradient,createPattern,lineWidth,lineCap,lineJoin,miterLimit,shadowOffsetX,shadowOffsetY,shadowBlur,shadowColor,clearRect,fillRect,strokeRect,beginPath,closePath,moveTo,lineTo,quadraticCurveTo,bezierCurveTo,arcTo,rect,arc,fill,stroke,clip,isPointInPath,font,textAlign,textBaseline,fillText,strokeText,measureText,drawImage,createImageData,getImageData,putImageData,addColorStop,direction,resize".split(",")),u={},p={},o={},x={},s={},y={};m.prototype={save:function(){this.b(),this.c(),this.n(),this.m(),this.z(),this.w(),this.F.push([this.g,this.h,this.A,this.v,this.k,this.i,this.j,this.l,this.q,this.r,this.o,this.p,this.f,this.s,this.t]),this.a.push(e.save)},restore:function(){var t=this.F;t.length&&(t=t.pop(),this.globalAlpha=t[0],this.globalCompositeOperation=t[1],this.strokeStyle=t[2],this.fillStyle=t[3],this.lineWidth=t[4],this.lineCap=t[5],this.lineJoin=t[6],this.miterLimit=t[7],this.shadowOffsetX=t[8],this.shadowOffsetY=t[9],this.shadowBlur=t[10],this.shadowColor=t[11],this.font=t[12],this.textAlign=t[13],this.textBaseline=t[14]),this.a.push(e.restore)},scale:function(t,i){this.a.push(e.scale,t,i)},rotate:function(t){this.a.push(e.rotate,t)},translate:function(t,i){this.a.push(e.translate,t,i)},transform:function(t,i,s,h,n,a){this.a.push(e.transform,t,i,s,h,n,a)},setTransform:function(t,i,s,h,n,a){this.a.push(e.setTransform,t,i,s,h,n,a)},b:function(){var t=this.a;this.g!==this.globalAlpha&&(this.g=this.globalAlpha,t.push(e.globalAlpha,this.g)),this.h!==this.globalCompositeOperation&&(this.h=this.globalCompositeOperation,t.push(e.globalCompositeOperation,this.h))},n:function(){if(this.A!==this.strokeStyle){var t=this.A=this.strokeStyle;if("string"!=typeof t){if(!(t instanceof k||t instanceof v))return;t=t.id}this.a.push(e.strokeStyle,t)}},m:function(){if(this.v!==this.fillStyle){var t=this.v=this.fillStyle;if("string"!=typeof t){if(!(t instanceof k||t instanceof v))return;t=t.id}this.a.push(e.fillStyle,t)}},createLinearGradient:function(t,i,s,n){return!(isFinite(t)&&isFinite(i)&&isFinite(s)&&isFinite(n)||!h(9)),this.a.push(e.createLinearGradient,t,i,s,n),new k(this)},createRadialGradient:function(t,i,s,n,a,o){return!(isFinite(t)&&isFinite(i)&&isFinite(s)&&isFinite(n)&&isFinite(a)&&isFinite(o)||!h(9)),(0>s||0>o)&&h(1),this.a.push(e.createRadialGradient,t,i,s,n,a,o),new k(this)},createPattern:function(i,s){i||h(17);var n,a=i.tagName,c=this.d;if(a)if(a=a.toLowerCase(),"img"===a)n=i.getAttribute("src",2);else{if(a===r||"video"===a)return;h(17)}else i.src?n=i.src:h(17);return"repeat"===s||"no-repeat"===s||"repeat-x"===s||"repeat-y"===s||""===s||s===l||h(12),this.a.push(e.createPattern,t(n),s),!p[c][n]&&u[c]&&(this.e(),++o[c],p[c][n]=!0),new v(this)},z:function(){var t=this.a;this.k!==this.lineWidth&&(this.k=this.lineWidth,t.push(e.lineWidth,this.k)),this.i!==this.lineCap&&(this.i=this.lineCap,t.push(e.lineCap,this.i)),this.j!==this.lineJoin&&(this.j=this.lineJoin,t.push(e.lineJoin,this.j)),this.l!==this.miterLimit&&(this.l=this.miterLimit,t.push(e.miterLimit,this.l))},c:function(){var t=this.a;this.q!==this.shadowOffsetX&&(this.q=this.shadowOffsetX,t.push(e.shadowOffsetX,this.q)),this.r!==this.shadowOffsetY&&(this.r=this.shadowOffsetY,t.push(e.shadowOffsetY,this.r)),this.o!==this.shadowBlur&&(this.o=this.shadowBlur,t.push(e.shadowBlur,this.o)),this.p!==this.shadowColor&&(this.p=this.shadowColor,t.push(e.shadowColor,this.p))},clearRect:function(t,i,s,h){this.a.push(e.clearRect,t,i,s,h)},fillRect:function(t,i,s,h){this.b(),this.c(),this.m(),this.a.push(e.fillRect,t,i,s,h)},strokeRect:function(t,i,s,h){this.b(),this.c(),this.n(),this.z(),this.a.push(e.strokeRect,t,i,s,h)},beginPath:function(){this.a.push(e.beginPath)},closePath:function(){this.a.push(e.closePath)},moveTo:function(t,i){this.a.push(e.moveTo,t,i)},lineTo:function(t,i){this.a.push(e.lineTo,t,i)},quadraticCurveTo:function(t,i,s,h){this.a.push(e.quadraticCurveTo,t,i,s,h)},bezierCurveTo:function(t,i,s,h,n,a){this.a.push(e.bezierCurveTo,t,i,s,h,n,a)},arcTo:function(t,i,s,n,a){0>a&&isFinite(a)&&h(1),this.a.push(e.arcTo,t,i,s,n,a)},rect:function(t,i,s,h){this.a.push(e.rect,t,i,s,h)},arc:function(t,i,s,n,a,o){0>s&&isFinite(s)&&h(1),this.a.push(e.arc,t,i,s,n,a,o?1:0)},fill:function(){this.b(),this.c(),this.m(),this.a.push(e.fill)},stroke:function(){this.b(),this.c(),this.n(),this.z(),this.a.push(e.stroke)},clip:function(){this.a.push(e.clip)},w:function(){var t=this.a;if(this.f!==this.font)try{var i=y[this.d];i.style.font=this.f=this.font;var s=i.currentStyle;t.push(e.font,[s.fontStyle,s.fontWeight,i.offsetHeight,s.fontFamily].join(" "))}catch(h){}this.s!==this.textAlign&&(this.s=this.textAlign,t.push(e.textAlign,this.s)),this.t!==this.textBaseline&&(this.t=this.textBaseline,t.push(e.textBaseline,this.t)),this.u!==this.canvas.currentStyle.direction&&(this.u=this.canvas.currentStyle.direction,t.push(e.direction,this.u))},fillText:function(i,s,h,n){this.b(),this.m(),this.c(),this.w(),this.a.push(e.fillText,t(i),s,h,n===z?1/0:n)},strokeText:function(i,s,h,n){this.b(),this.n(),this.c(),this.w(),this.a.push(e.strokeText,t(i),s,h,n===z?1/0:n)},measureText:function(t){var i=y[this.d];try{i.style.font=this.font}catch(e){}return i.innerText=(""+t).replace(/[ \n\f\r]/g,"	"),new S(i.offsetWidth)},drawImage:function(i,s,n,a,l,c,f,d,m){i||h(17);var v,g=i.tagName,w=arguments.length,C=this.d;if(g)if(g=g.toLowerCase(),"img"===g)v=i.getAttribute("src",2);else{if(g===r||"video"===g)return;h(17)}else i.src?v=i.src:h(17);if(this.b(),this.c(),v=t(v),3===w)this.a.push(e.drawImage,w,v,s,n);else if(5===w)this.a.push(e.drawImage,w,v,s,n,a,l);else{if(9!==w)return;(0===a||0===l)&&h(1),this.a.push(e.drawImage,w,v,s,n,a,l,c,f,d,m)}!p[C][v]&&u[C]&&(this.e(),++o[C],p[C][v]=!0)},loadImage:function(i,s,h){var n,a=i.tagName,r=this.d;a?"img"===a.toLowerCase()&&(n=i.getAttribute("src",2)):i.src&&(n=i.src),n&&!p[r][n]&&((s||h)&&(x[r][n]=[i,s,h]),this.a.push(e.drawImage,1,t(n)),u[r]&&(this.e(),++o[r],p[r][n]=!0))},D:function(){this.globalAlpha=this.g=1,this.globalCompositeOperation=this.h="source-over",this.fillStyle=this.v=this.strokeStyle=this.A="#000000",this.lineWidth=this.k=1,this.lineCap=this.i="butt",this.lineJoin=this.j="miter",this.miterLimit=this.l=10,this.shadowBlur=this.o=this.shadowOffsetY=this.r=this.shadowOffsetX=this.q=0,this.shadowColor=this.p="rgba(0, 0, 0, 0.0)",this.font=this.f="10px sans-serif",this.textAlign=this.s="start",this.textBaseline=this.t="alphabetic",this.a=[],this.F=[]},H:function(){var t=this.a;return this.a=[],t},e:function(){var a=this.H();return a.length>0?eval(this.B.CallFunction('<invoke name="executeCommand" returntype="javascript"><arguments><string>'+a.join("&#0;")+"</string></arguments></invoke>")):void 0},I:function(t,i){this.e(),this.D(),t>0&&(this.B.width=t),i>0&&(this.B.height=i),this.a.push(e.resize,t,i)}},k.prototype={addColorStop:function(t,i){(isNaN(t)||0>t||t>1)&&h(1),this.G.a.push(e.addColorStop,this.id,t,i)}},D.prototype=Error();var R={1:"INDEX_SIZE_ERR",9:"NOT_SUPPORTED_ERR",11:"INVALID_STATE_ERR",12:"SYNTAX_ERR",17:"TYPE_MISMATCH_ERR",18:"SECURITY_ERR"},B={initElement:function(t){if(t.getContext)return t;var h=Math.random().toString(36).slice(2)||"0",n="external"+h;u[h]=!1,p[h]={},o[h]=1,x[h]={},P(t),t.innerHTML='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+location.protocol+'//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="100%" height="100%" id="'+n+'"><param name="allowScriptAccess" value="always"><param name="flashvars" value="id='+n+'"><param name="wmode" value="transparent"></object><span style="margin:0;padding:0;border:0;display:inline-block;position:static;height:1em;overflow:visible;white-space:nowrap"></span>',s[h]=t;var a=t.firstChild;y[h]=t.lastChild;var r=j.body.contains;if(r(t))a.movie=w;else var c=setInterval(function(){r(t)&&(clearInterval(c),a.movie=w)},0);"BackCompat"!==j.compatMode&&i.XMLHttpRequest||(y[h].style.overflow="hidden");var f=new m(t,a);return t.getContext=function(t){return"2d"===t?f:l},t.toDataURL=function(t,i){return"image/jpeg"===(""+t).replace(/[A-Z]+/g,U)?f.a.push(e.toDataURL,t,"number"==typeof i?i:""):f.a.push(e.toDataURL,t),f.e()},a.attachEvent(J,F),t},saveImage:function(t,i){t.firstChild.saveImage(i)},setOptions:function(){},trigger:function(t,i){s[t].fireEvent("on"+i)},unlock:function(t,i,e){var h,n,a;o[t]&&--o[t],i===z?(h=s[t],i=h.firstChild,P(h),n=h.width,e=h.height,h.style.width=n+"px",h.style.height=e+"px",n>0&&(i.width=n),e>0&&(i.height=e),i.resize(n,e),h.attachEvent(K,G),u[t]=!0,"function"==typeof h.onload&&setTimeout(function(){h.onload()},0)):(a=x[t][i])&&(n=a[0],e=a[1+e],delete x[t][i],"function"==typeof e&&e.call(n))}};if(j.createElement(r),j.createStyleSheet().cssText=r+"{display:inline-block;overflow:hidden;width:300px;height:150px}","complete"===j.readyState?A():j.attachEvent(E,A),i.attachEvent(I,H),0===w.indexOf(location.protocol+"//"+location.host+"/")){var Q=new ActiveXObject("Microsoft.XMLHTTP");Q.open("GET",w,!1),Q.send(l)}i[L]=m,i[M]=k,i[N]=v,i[C]=B,i[O]={init:function(){},init_:function(){},initElement:B.initElement},keep=[m.measureText,m.loadImage]}(window,document);