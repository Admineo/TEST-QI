const CATEGORIES = ["Logique", "Calcul mental", "Observation visuelle"];

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function wrongNumbers(answer, count = 3) {
  const candidates = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 5, answer - 5, answer * 2, Math.floor(answer / 2), answer + 10, answer - 10];
  return [...new Set(candidates.filter((n) => Number.isFinite(n) && n >= 0 && n !== answer))].slice(0, count);
}
function question(category, text, answer, wrong, explanation, visual = "") {
  const options = shuffled([{ value: String(answer), correct: true }, ...wrong.map((value) => ({ value: String(value), correct: false }))]);
  return { category, text, options: options.map((item) => item.value), answer: options.findIndex((item) => item.correct), explanation, visual };
}
function numericQuestion(category, text, answer, explanation) { return question(category, text, answer, wrongNumbers(answer), explanation); }

function visualShapes(i) {
  const types = ["carré", "cercle", "triangle", "losange"];
  const labels = ["Carré", "Cercle", "Triangle", "Losange"];
  const a = i % 4, b = (a + 1 + (i % 3)) % 4;
  const coords = [
    (x, color) => `<rect x='${x-15}' y='28' width='30' height='30' rx='4' fill='${color}'/>`,
    (x, color) => `<circle cx='${x}' cy='43' r='16' fill='${color}'/>`,
    (x, color) => `<path d='M${x} 23 L${x+17} 57 H${x-17} Z' fill='${color}'/>`,
    (x, color) => `<path d='M${x} 22 L${x+18} 43 L${x} 64 L${x-18} 43 Z' fill='${color}'/>`
  ];
  const seq=[a,b,a,b];
  const svg=`<svg viewBox='0 0 360 86' role='img' aria-label='Suite alternée de formes'>${seq.map((s,k)=>coords[s](35+k*82,k%2?'#c084fc':'#06b6d4')).join("")}</svg>`;
  return question("Observation visuelle", "Quelle forme complète cette alternance ?", labels[a], labels.filter((_,k)=>k!==a), "Les deux formes alternent : la prochaine reprend la première forme de la série.", svg);
}
function visualArrows(i) {
  const glyphs=["↑","→","↓","←"], start=i%4, direction=i%2?3:1;
  const seq=Array.from({length:4},(_,j)=>(start+j*direction+8)%4);
  const answer=glyphs[(start+4*direction)%4];
  const svg=`<svg viewBox='0 0 360 86' role='img' aria-label='Quatre flèches indiquant une rotation régulière'>${seq.map((v,k)=>`<text x='${30+k*82}' y='62' font-size='48' fill='${k%2?'#a855f7':'#0891b2'}'>${glyphs[v]}</text>`).join("")}</svg>`;
  return question("Observation visuelle","Quelle flèche vient ensuite ?",answer,glyphs.filter(x=>x!==answer),`La flèche tourne d’un quart de tour ${direction===1?"dans le sens horaire":"dans le sens antihoraire"} à chaque étape.`,svg);
}
function visualDots(i) {
  const start=1+(i%6), counts=[start,start+1,start+2], answer=start+3;
  const circles=counts.map((n,g)=>Array.from({length:n},(_,k)=>`<circle cx='${24+g*82+(k%4)*12}' cy='${29+Math.floor(k/4)*12}' r='4' fill='${g%2?'#a855f7':'#0891b2'}'/>`).join("")).join("");
  const svg=`<svg viewBox='0 0 360 80' role='img' aria-label='Groupes de points en augmentation'>${circles}</svg>`;
  return question("Observation visuelle","Combien de points aura le groupe suivant ?",answer,[answer+1,answer-1,answer+2],`Chaque groupe gagne un point : après ${counts.join(", ")}, le suivant en compte ${answer}.`,svg);
}
function visualGrid(i) {
  const rows=2+(i%3), cols=2+(Math.floor(i/3)%3), answer=rows*cols;
  const x=15,y=10,w=120/cols,h=120/rows;
  let lines="";
  for(let c=0;c<=cols;c++) lines+=`<path d='M${x+c*w} ${y} V${y+rows*h}'/>`;
  for(let r=0;r<=rows;r++) lines+=`<path d='M${x} ${y+r*h} H${x+cols*w}'/>`;
  const svg=`<svg viewBox='0 0 150 140' role='img' aria-label='Grille de ${rows} rangées sur ${cols} colonnes'><g fill='none' stroke='#0891b2' stroke-width='3'>${lines}</g></svg>`;
  return question("Observation visuelle",`Combien de cases contient une grille de ${rows} rangées et ${cols} colonnes ?`,answer,[answer+1,answer-1,answer+rows+1],`${rows} × ${cols} = ${answer} cases.`,svg);
}
function buildBank() {
  const bank=[];
  // 50 calcul mental : additions, soustractions, multiplications, divisions, fractions, pourcentages, priorités.
  for(let i=0;i<50;i++) {
    const mode=i%7, n=11+i*3;
    if(mode===0){const a=23+i*2,b=17+(i*7)%41,ans=a+b;bank.push(numericQuestion("Calcul mental",`Calculez ${a} + ${b}.`,ans,`${a} + ${b} = ${ans}.`));}
    else if(mode===1){const a=80+i*4,b=13+(i*5)%Math.max(14,a-20),ans=a-b;bank.push(numericQuestion("Calcul mental",`Calculez ${a} − ${b}.`,ans,`${a} − ${b} = ${ans}.`));}
    else if(mode===2){const a=6+i%15,b=4+(i*3)%11,ans=a*b;bank.push(numericQuestion("Calcul mental",`Combien font ${a} × ${b} ?`,ans,`${a} × ${b} = ${ans}.`));}
    else if(mode===3){const d=3+i%12,q=9+i,ans=q;bank.push(numericQuestion("Calcul mental",`Calculez ${d*q} ÷ ${d}.`,ans,`${d*q} ÷ ${d} = ${ans}.`));}
    else if(mode===4){const p=[10,20,25,50][i%4],base=80+20*i,ans=base*p/100;bank.push(numericQuestion("Calcul mental",`Combien font ${p} % de ${base} ?`,ans,`${base} × ${p} ÷ 100 = ${ans}.`));}
    else if(mode===5){const den=2+i%5,whole=(8+i)*den,ans=whole/den;bank.push(numericQuestion("Calcul mental",`Quelle est la ${den===2?"moitié":den===4?"quart":`${den}e partie`} de ${whole} ?`,ans,`${whole} ÷ ${den} = ${ans}.`));}
    else {const a=12+i,b=3+i%9,ans=a+b*2;bank.push(numericQuestion("Calcul mental",`Respectez les priorités : ${a} + ${b} × 2 = ?`,ans,`La multiplication d’abord : ${b} × 2 = ${b*2}, puis ${a} + ${b*2} = ${ans}.`));}
  }
  // 50 raisonnement : suites, motifs numériques et déduction.
  const names=["Nors","Vels","Tims","Lumas","Pavos","Rilons","Dovés","Mérals","Sélans","Kavans"];
  for(let i=0;i<50;i++) {
    const mode=i%5;
    if(mode===0){const start=3+i,step=2+i%9,seq=[0,1,2,3].map(k=>start+k*step),ans=start+4*step;bank.push(numericQuestion("Logique",`Quel nombre suit : ${seq.join(", ")}, … ?`,ans,`On ajoute ${step} à chaque étape : le nombre suivant est ${ans}.`));}
    else if(mode===1){const start=2+i%10,seq=[start,start*2,start*4,start*8],ans=start*16;bank.push(numericQuestion("Logique",`Complétez la suite : ${seq.join(", ")}, …`,ans,`Chaque terme est multiplié par 2 : ${seq[3]} × 2 = ${ans}.`));}
    else if(mode===2){const start=2+i,seq=[start*start,(start+1)**2,(start+2)**2],ans=(start+3)**2;bank.push(numericQuestion("Logique",`Quels carrés parfaits complètent la suite ${seq.join(", ")}, … ?`,ans,`Ce sont des carrés consécutifs ; le suivant vaut ${start+3}² = ${ans}.`));}
    else if(mode===3){const step=1+i%4,start=1+i%5,seq=Array.from({length:4},(_,k)=>String.fromCharCode(65+start-1+k*step)),ans=String.fromCharCode(65+start-1+4*step);const wrong=[-2,-1,1].map(d=>String.fromCharCode(ans.charCodeAt(0)+d));bank.push(question("Logique",`Quelle lettre suit : ${seq.join(", ")}, … ?`,ans,wrong,`On avance de ${step} lettre(s) à chaque étape ; la prochaine est ${ans}.`));}
    else {const a=names[i%10],b=names[(i+3)%10],c=names[(i+6)%10];bank.push(question("Logique",`Tous les ${a} sont des ${b}. Tous les ${b} sont des ${c}. Quelle conclusion est certaine ?`,`Tous les ${a} sont des ${c}`,[`Tous les ${c} sont des ${a}`,`Aucun ${a} n’est un ${c}`,`Tous les ${b} sont des ${a}`],`La relation est transitive : tous les ${a} sont des ${b}, et tous les ${b} des ${c}.`));}
  }
  // 50 observations visuelles : formes, rotations, dénombrement, grilles.
  for(let i=0;i<50;i++){const mode=i%4;bank.push(mode===0?visualShapes(i):mode===1?visualArrows(i):mode===2?visualDots(i):visualGrid(i));}
  return bank;
}
window.TEST_QUESTION_CATEGORIES=CATEGORIES;
window.TEST_QUESTION_BANK=buildBank();
