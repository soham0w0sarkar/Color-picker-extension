const button = document.querySelector(".button");
const display = document.querySelector(".display");
const heading = document.querySelector("p");
const popup = document.querySelector(".popup");
let colorCount = 0;

const grid = `<span class="colorGrid">
                    <span class="color"></span>
                    <span class="hex">color</span>
              </span>`;

button.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },

    async (results) => {
      const [data] = results;

      if (!data.result) return;

      const color = data.result.sRGBHex;
      heading.classList.add("hidden");
      display.classList.remove("hidden");

      display.innerHTML += grid;

      const colorGrids = document.querySelectorAll(".colorGrid");
      const colorGrid = colorGrids[colorCount];

      const colorGridcolor = colorGrid.children[0];
      const colorGridname = colorGrid.children[1];

      colorGridcolor.style.backgroundColor = color;
      colorGridname.innerText = color;

      colorGrids.forEach((colorGrid) => {
        colorGrid.addEventListener("click", async () => {
          const color = colorGrid.children[1].innerText;

          try {
            await navigator.clipboard.writeText(color);

            popup.classList.add("show-popup");
            setTimeout(() => {
              popup.classList.remove("show-popup");
            }, 1000);
          } catch (error) {
            console.error(error);
          }
        });
      });

      colorCount++;
    }
  );
});

const pickColor = async () => {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (error) {
    console.error(error);
  }
};
