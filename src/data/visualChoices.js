export const nightDesires = [
  {id:'rest',label:'ゆっくり落ち着きたい',parts:['ゆっくり','落ち着きたい'],nightId:'quiet',nightIds:['quiet','after-work','lingering','ordinary'],icon:'moon'},
  {id:'reset',label:'ぱーっと発散したい',parts:['ぱーっと','発散したい'],nightId:'reset',nightIds:['reset','celebrate'],icon:'wind'},
  {id:'treat',label:'少し贅沢したい',parts:['少し','贅沢したい'],nightId:'treat',nightIds:['treat'],icon:'sparkles'},
  {id:'dinner',label:'しっかり食べたい',parts:['しっかり','食べたい'],nightId:'dinner',nightIds:['dinner'],icon:'bowl'},
  {id:'one',label:'軽く一杯だけ',parts:['軽く','一杯だけ'],nightId:'just-one',nightIds:['just-one'],icon:'cup'},
  {id:'together',label:'誰かと話したい',parts:['誰かと','話したい'],nightId:'together',nightIds:['together'],icon:'conversation'},
];
export const desireForNight=id=>nightDesires.find(d=>d.nightIds.includes(id));
export const nightChoiceLabel=night=>desireForNight(night.id)?.label||night.name;
export const seasonalIcons={spring:'leaf',rain:'rain',humid:'sun',festival:'sparkles',moon:'moon',autumn:'leaf',cold:'bowl',snow:'snow','year-end':'calendar'};
