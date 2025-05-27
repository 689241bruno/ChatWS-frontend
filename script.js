const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
//chat elementos
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");
//hora e minutos

const getHoraMinutos = () => {
  const dataAtual = new Date();
  const horas = String(dataAtual.getHours()).padStart(2, "0");
  const minutos = String(dataAtual.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
};

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const user = { id: "", nome: "", color: "" };

let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--self");
  span.classList.add("hora");
  span.innerHTML = getHoraMinutos();
  div.textContent = content;
  div.appendChild(span);

  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const p = document.createElement("p");
  const message = document.createElement("p");

  div.classList.add("message--other");
  p.classList.add("message--sender");
  span.classList.add("hora");

  p.style.color = senderColor;
  p.textContent = sender;

  message.textContent = content;

  span.innerHTML = getHoraMinutos();

  div.appendChild(p);
  div.appendChild(message);
  div.appendChild(span);

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const processMessage = ({ data }) => {
  const { userID, userName, userColor, content } = JSON.parse(data);

  const message =
    userID == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessages.appendChild(message);

  scrollScreen();
};

const handleLogin = (event) => {
  event.preventDefault();
  user.id = crypto.randomUUID();
  user.nome = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("https://websocket-nl7f.onrender.com");

  websocket.onopen = () => {
    websocket.send(`Usuário: ${user.nome} entrou no chat`);
  };
  websocket.onmessage = processMessage;
  console.log(user);
};

const sendMessage = (event) => {
  event.preventDefault();

  if (websocket.readyState !== WebSocket.OPEN) {
    alert("A conexão com o servidor ainda não foi estabelecida.");
    return;
  }
  const message = {
    userID: user.id,
    userName: user.nome,
    userColor: user.color,
    content: chatInput.value,
  };
  websocket.send(JSON.stringify(message));

  chatInput.value = "";
};

window.scrollTo({
  top: document.body.scrollHeight,
  behavior: "smooth",
});

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
