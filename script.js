const wordList = {
    easy: ["ねこ", "いぬ", "やま", "かわ", "ゆき", "そら", "すいか", "たまご"],
    normal: ["でんしゃ", "せんせい", "けいたい", "こうこう", "しゅくだい", "びょういん"],
    hard: ["しょうがっこう", "びじゅつかん", "しょくぶつえん", "けいさつしょ", "ちょうみりょう"]
  };
  
  let currentWord = "";
  let romajiWord = "";
  let score = 0;
  let time = 60;
  let timerId;
  let level = "easy";
  let bgmPlaying = false;
  
  const wordDiv = document.getElementById("word");
  const input = document.getElementById("input");
  const scoreSpan = document.getElementById("score");
  const timerSpan = document.getElementById("timer");
  const resultDiv = document.getElementById("result");
  const rankingOl = document.getElementById("ranking");
  
  const bgm = document.getElementById("bgm");
  const correctSound = document.getElementById("correct-sound");
  
  function toggleBGM() {
    if (bgmPlaying) {
      bgm.pause();
    } else {
      bgm.play();
    }
    bgmPlaying = !bgmPlaying;
  }
  
  function setLevel(selectedLevel) {
    level = selectedLevel;
    resetGame();
  }
  
  function resetGame() {
    score = 0;
    time = 60;
    scoreSpan.textContent = score;
    timerSpan.textContent = time;
    input.disabled = false;
    input.value = "";
    input.focus();
    resultDiv.textContent = "";
    clearInterval(timerId);
    nextWord();
    timerId = setInterval(() => {
      time--;
      timerSpan.textContent = time;
      if (time <= 0) {
        clearInterval(timerId);
        input.disabled = true;
        resultDiv.textContent = `⏰ 時間切れ！最終スコア: ${score}`;
        saveScore(score);
        showRanking();
      }
    }, 1000);
  }
  
  function nextWord() {
    const words = wordList[level];
    const jp = words[Math.floor(Math.random() * words.length)];
    currentWord = jp;
    romajiWord = toRomaji(jp);
    wordDiv.textContent = `${currentWord}（${romajiWord}）`;
    input.value = "";
  }
  
  input.addEventListener("input", () => {
    if (input.value === romajiWord) {
      score++;
      scoreSpan.textContent = score;
      correctSound.currentTime = 0;
      correctSound.play();
      nextWord();
    }
  });
  
  function toRomaji(jp) {
    const map = {
      あ: "a", い: "i", う: "u", え: "e", お: "o",
      か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
      さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
      た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
      な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
      は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
      ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
      や: "ya", ゆ: "yu", よ: "yo",
      ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
      わ: "wa", を: "wo", ん: "n",
      が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
      ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
      だ: "da", で: "de", ど: "do",
      ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
      ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
      きゃ: "kya", きゅ: "kyu", きょ: "kyo",
      しゃ: "sha", しゅ: "shu", しょ: "sho",
      ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
      にゃ: "nya", にゅ: "nyu", にょ: "nyo",
      ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
      みゃ: "mya", みゅ: "myu", みょ: "myo",
      りゃ: "rya", りゅ: "ryu", りょ: "ryo"
    };
  
    let result = "";
    let i = 0;
    while (i < jp.length) {
      const twoChar = jp[i] + (jp[i + 1] || "");
      if (map[twoChar]) {
        result += map[twoChar];
        i += 2;
      } else if (map[jp[i]]) {
        result += map[jp[i]];
        i += 1;
      } else {
        result += jp[i];
        i += 1;
      }
    }
    return result;
  }
  
  function saveScore(newScore) {
    let scores = JSON.parse(localStorage.getItem("ranking") || "[]");
    scores.push(newScore);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    localStorage.setItem("ranking", JSON.stringify(scores));
  }
  
  function showRanking() {
    let scores = JSON.parse(localStorage.getItem("ranking") || "[]");
    rankingOl.innerHTML = "";
    scores.forEach(score => {
      const li = document.createElement("li");
      li.textContent = `${score} 点`;
      rankingOl.appendChild(li);
    });
  }
  
  // 初期表示
  showRanking();
  