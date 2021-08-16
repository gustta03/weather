document.querySelector(".busca").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.querySelector("#searchInput").value;
  if (input != "") {
    clearInfo();
    document.querySelector(".aviso").style.color = '#000';
    showWarning("Carregando...");

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
      input
    )}&appid=d06cdb298fafc83c520d5ab677fc477e&units=metric&lang=pt_br`;

    let results = await fetch(url);

    let json = await results.json();

    console.log(json);

    if (json.cod === 200) {
      showInfo({
        name: json.name,
        country: json.sys.country,
        temp: json.main.temp,
        tempIcon: json.weather[0].icon,
        windSpeed: json.wind.speed,
        WindAngle: json.wind.deg,
      });
    } else {
      document.querySelector(".aviso").style.color = 'red';
      showWarning("Não encontramos esta localização.");
    }
  }
});

function showInfo(json) {
  showWarning("");

  document.querySelector(".results").style.display = "block";
  document.querySelector(".titulo").innerHTML = `${json.name}, ${json.country}`;
  document.querySelector(".tempInfo").innerHTML = `${json.temp} <sup>ºC</sup>`;
  document.querySelector(
    ".ventoInfo"
  ).innerHTML = `${json.windSpeed} <span>km/h</span>`;

  document
    .querySelector(".temp img")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`
    );

  document.querySelector(".ventoPonto").style.transform = `rotate(${
    json.WindAngle - 90
  }deg)`;
}

function showWarning(msg) {
  document.querySelector(".aviso").innerHTML = msg;
}

function clearInfo() {
  showWarning("");
  document.querySelector(".results").style.display = "none";
}

const html = document.querySelector("html");
const checkbox = document.querySelector("input[name=theme]");

const getStyle = (element, style) =>
  window.getComputedStyle(html).getPropertyValue("--bg");

const initialColors = {
  bgColorText: getStyle(html, "--text"),
  bg: getStyle(html, "--bg"),
};

const darkMode = {
  colorText: '#FFF',
  bg: '#363542'
}
const transformKey = key => '--' + key.replace(/([A-Z])/, '$1').toLowerCase()



const changeColors = (colors) => {
  Object.keys(colors).map(key => 
      html.style.setProperty(transformKey(key), colors[key]) 
  )
}

checkbox.addEventListener('change', ({target}) => {
  target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

const isExistLocalStorage = (key) => 
  localStorage.getItem(key) != null

const createOrEditLocalStorage = (key, value) => 
  localStorage.setItem(key, JSON.stringify(value))

const getValeuLocalStorage = (key) =>
  JSON.parse(localStorage.getItem(key))

checkbox.addEventListener("change", ({target}) => {
  if (target.checked) {
    changeColors(darkMode) 
    createOrEditLocalStorage('modo','darkMode')
  } else {
    changeColors(initialColors)
    createOrEditLocalStorage('modo','initialColors')
  }
})

if(!isExistLocalStorage('modo'))
  createOrEditLocalStorage('modo', 'initialColors')


if (getValeuLocalStorage('modo') === "initialColors") {
  checkbox.removeAttribute('checked')
  changeColors(initialColors);
} else {
  checkbox.setAttribute('checked', "")
  changeColors(darkMode);
}