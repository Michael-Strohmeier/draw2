let kanjiTable = [['私(わたし)', 'I'], ['日(に)本(ほん)人(じん)', 'Japanese person'], ['日(に)本(ほん)語(ご)', 'Japanese Language'], ['本(ほん)人(にん)', 'the person in question; the person themselves'], ['です', 'be; is\u200b'], ['今(きょう)日', 'today; this day'], ['一(いち)', 'one'], ['国(くに)', 'country; state'], ['国(くに)語(ご)', 'national language'], ['会(かい)見(けん)', 'interview; audience; meeting; (viewing) party'], ['三(さん)人(にん)', 'three people'], ['二(ふた)人(り)', 'two persons; two people; pair; couple'], ['一(ひと)人(り)', 'one person'], ['今(こ)年(とし)', 'this year'], ['一(いち)年(ねん)', 'one year; some time ago'], ['大(おと)人(な)', 'adult'], ['大(おお)きい', 'big; large; great'], ['十(じゅう)', 'ten'], ['十(とお)日(か)', 'tenth day of the month'], ['十(じゅう)一(いち)', 'eleven; 11']];

let strokeOrders;

function preload() {
  strokeOrders = loadFont('assets/KanjiStrokeOrders_v4.004.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  app = new App();
  
}

function mousePressed() {
  app.click(mouseX, mouseY);
}

function draw() {
  background(255);
  app.draw();
}

function copyStringToClipboard(str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}

class KanjiCard {
  constructor() {
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;
    this.n = -1;
    this.color = color(0);
    
    this.textSize = 125;
    
    this.d = {};
    this.clean = "";
    
    this.definition = "";
  }

  setKanjiNumber(n) {
    // this.n = n;
    this.n++;
    this.what();
  }
  
  getClean() {
    return this.clean;
  }
  
  
  
  what() {
    let s = kanjiTable[this.n][0];
    this.definition = kanjiTable[this.n][1];
    
    let d = {};
    
    let clean = "";
    let i = 0;
    let kanji = "";
    let temp = "";
    
    while (i < s.length) {
      kanji = s[i];
      if (s[i] == '(') {
        temp = ""
        kanji = s[i - 1];

        i += 1;
        while (s[i] != ')') {
          temp += s[i];
          i += 1;
        }
        
        d[kanji] = temp;
        i += 1;
        continue;
          
      }
      
      clean += kanji;
      i += 1;
      
    }
    
  this.clean = clean;
  this.d = d;

    

  }
  
  draw() {
    push();
    translate(this.x, this.y);
    
    
    textAlign(CENTER, CENTER);
    textFont(strokeOrders);
    // kanji
    let offsetX = (this.clean.length - 1) * this.textSize / 2;
    for (let i = 0; i < this.clean.length; i++) {
      
      if (this.clean[i] in this.d) {
        textSize(this.textSize / 2.3);
        text(this.d[this.clean[i]], this.textSize * i - offsetX, -this.textSize / 1.2);

      }

      textSize(this.textSize);
      text(this.clean[i], this.textSize * i - offsetX, 0);
      
      

    }
    
    textFont('Georgia');
    textSize(this.textSize / 6);
    text(this.definition, 0, 100);
    
    pop();
  }
  
  
}

class CopyButton {
  constructor() {
    this.w = 40;
    this.h = 40;
    
    this.x = windowWidth / 2 - this.w / 2;
    this.y = windowHeight - this.h * 2;

    
    this.t = -20000;
  }
  
  copy(s) {
    copyStringToClipboard(s);
  }
  
  click(x, y) {
    if ((x > this.x) && (x < this.x + this.w) &&
        (y > this.y) && (y < this.y + this.h)) {
        this.t = millis();
        return true;
      }
    return false;
  }
  
  draw() {
    push();
    noStroke();
    if (millis() - this.t > 300) {
      fill(140, 140, 140);
    } else {
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(12);
      text("copied to clipboard", this.x + this.w / 2, this.y - this.h / 2);
      
      fill(200, 200, 200);
    }
    
    rect(this.x, this.y, this.w, this.h, 15);
    pop();
  }
}

class App {
  constructor() {
    this.maxKanjiNumber = kanjiTable.length;
    this.kanjiNumber = 0;
    
    this.kanjiCard = new KanjiCard();
    this.setup();
    
    this.copyButton = new CopyButton();
  }
  
  setup() {
    this.nextCard();
  }
  
  click(x, y) {
    if (this.copyButton.click(x, y)) {
      this.copyButton.copy(this.kanjiCard.getClean());
    } else {
      this.nextCard();
    }
  }
  
  nextCard() {
    let tempNum = this.kanjiNumber;
    while (tempNum == this.kanjiNumber) {
      tempNum = Math.floor(Math.random() * this.maxKanjiNumber);
    }
    
    this.kanjiNumber = tempNum;
    this.kanjiCard.setKanjiNumber(this.kanjiNumber);
    
  }
  
  draw() {
    background(184, 216, 255, 130);
    this.kanjiCard.draw();
    this.copyButton.draw();
  }
  
  
}
