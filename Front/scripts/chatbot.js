document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    
    chatContainer.innerHTML = `
        <div id="chat-window" class="chat-window">
            <div class="chat-header">
                <div class="header-info">
                    <i class="fa-solid fa-robot"></i>
                    <span>Guía ExZooTic</span>
                </div>
                <button id="btn-close-chat" class="close-chat">&times;</button>
            </div>
            
            <div id="chat-messages" class="chat-messages">
                <div class="message bot-message">
                    <p>¡Hola explorador! 🌿 Soy tu guía virtual. ¿En qué puedo ayudarte hoy?</p>
                </div>
            </div>

            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Escribe tu duda aqui..." autocomplete="off">
                <button id="btn-send-chat">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>

        <button id="btn-chat-toggle" class="btn-flotante-chat" title="Asistente Virtual">
            <i class="fa-solid fa-comments"></i>
        </button>
    `;

    document.body.appendChild(chatContainer);

    const btnToggle = document.getElementById("btn-chat-toggle");
    const btnClose = document.getElementById("btn-close-chat");
    const chatWindow = document.getElementById("chat-window");
    const input = document.getElementById("chat-input");
    const btnSend = document.getElementById("btn-send-chat");
    const messagesContainer = document.getElementById("chat-messages");

    const toggleChat = () => {
        chatWindow.classList.toggle("mostrar-chat");
        if (chatWindow.classList.contains("mostrar-chat")) {
            input.focus();
        }
    };

    btnToggle.addEventListener("click", toggleChat);
    btnClose.addEventListener("click", toggleChat);

    document.addEventListener("click", (e) => {
        if (chatWindow.classList.contains("mostrar-chat")) {
            
            const clickEnElChat = chatWindow.contains(e.target);
            const clickEnElBoton = btnToggle.contains(e.target);

            if (!clickEnElChat && !clickEnElBoton) {
                toggleChat();
            }
        }
    });

    const addMessage = (text, sender) => {
        const div = document.createElement("div");
        div.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        div.innerHTML = `<p>${text}</p>`;
        messagesContainer.appendChild(div);
        
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: "smooth"
        });
    };

    const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";
        
        setTimeout(() => {
            addMessage("¡Entendido! Pronto estaré conectado a mi cerebro de IA para responderte eso.", "bot");
        }, 1000);
    };

    btnSend.addEventListener("click", handleSend);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
});