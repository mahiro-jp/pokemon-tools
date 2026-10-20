const checkButton = document.querySelector("#check-button");
const result = document.querySelector("#result");
let clickCount = 0;

checkButton.addEventListener("click", () => {
  clickCount += 1;
  result.textContent = `JavaScriptは正常に動作しています（クリック回数: ${clickCount}回）。`;
});
